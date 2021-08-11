use std::io::prelude::*;
use std::net::*;

pub fn single_thread_server() {
  let listener = TcpListener::bind("127.0.0.1:7878").unwrap();

  for stream in listener.incoming() {
    let stream: TcpStream = stream.unwrap();

    println!("Connection established!");

    handle_connection(stream).unwrap();
  }
}

fn handle_connection(mut stream: TcpStream) -> std::io::Result<()> {
  let mut buffer = [0; 1204];
  stream.read(&mut buffer)?;
  println!("recv: {}", String::from_utf8_lossy(&buffer));

  let content = r#"
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Hello!</title>
    </head>
    <body>
      <h1>Hello!</h1>
      <p>Hi from Rust</p>
    </body>
  </html>
  "#;

  let response = format!(
    "HTTP/1.1 200 OK\r\nContent-Length: {}\r\n\r\n{}",
    content.len(),
    content
  );
  stream.write(response.as_bytes())?;
  stream.flush()?;
  Ok(())
}
