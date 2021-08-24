use clap::{App, Arg};
use futures::{stream, StreamExt};
use std::{
    net::{IpAddr, SocketAddr, ToSocketAddrs},
    time::Duration,
};
use tokio::net::TcpStream;

mod common_ports;

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    let matches = App::new("port-scan")
        .version("0.0.1")
        .arg(
            Arg::with_name("target")
                .help("Target ip/domain")
                .required(true)
                .takes_value(true),
        )
        .arg(
            Arg::with_name("concurency")
                .help("Concurency")
                .short("c")
                .default_value("2000")
                .takes_value(true),
        )
        .arg(
            Arg::with_name("timeout")
                .help("Connection timeout in seconds")
                .short("timeout")
                .default_value("3"),
        )
        .arg(
            Arg::with_name("full")
                .help("Scan all 65535 ports")
                .long("full"),
        )
        .setting(clap::AppSettings::ArgRequiredElseHelp)
        .setting(clap::AppSettings::VersionlessSubcommands)
        .get_matches();
    let target = matches.value_of("target").unwrap();
    let concurency = matches
        .value_of("concurency")
        .unwrap()
        .parse()
        .unwrap_or(10);
    let timeout_sec = matches.value_of("timeout").unwrap().parse().unwrap_or(3);
    let full = matches.is_present("full");

    let full_msg = match full {
        true => "all the 65535 ports",
        false => "the most common 1002 ports",
    };
    println!(
        "Do Scan {}. target={}, concurency={}, timeout={} sec",
        full_msg, &target, &concurency, &timeout_sec
    );

    // Resolve ip from domains
    let soc_addr: Vec<SocketAddr> = format!("{}:0", target).to_socket_addrs()?.collect();
    if soc_addr.is_empty() {
        return Err(anyhow::anyhow!("Can not resolve ip address"));
    }

    scan(soc_addr[0].ip(), concurency, timeout_sec, full).await;
    Ok(())
}

async fn scan(target: IpAddr, concurency: usize, timeout_sec: u64, is_full: bool) {
    let ports: Box<dyn Iterator<Item = u16>> = match is_full {
        true => Box::new((1..=u16::MAX).into_iter()),
        false => Box::new(common_ports::MOST_COMMON_PORTS_1002.to_owned().into_iter()),
    };
    stream::iter(ports)
        .for_each_concurrent(concurency, |port| async move {
            let timeout = Duration::from_secs(timeout_sec);
            let socket_address = SocketAddr::new(target.clone(), port);

            let res = tokio::time::timeout(timeout, TcpStream::connect(&socket_address)).await;
            // not timeout and TCPStream promise is_ok also
            if res.is_ok() && res.unwrap().is_ok() {
                println!("{}", port);
            }
        })
        .await;
}
