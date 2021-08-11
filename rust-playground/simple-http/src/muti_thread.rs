use std::io::prelude::*;
use std::net::*;
use std::sync::mpsc::{channel, Receiver, Sender};
use std::sync::Arc;
use std::sync::Mutex;
use std::thread::JoinHandle;
use std::time::SystemTime;

struct ThreadPool {
  size: u32,
  sender: Sender<Message>,
  handlers: Vec<Option<JoinHandle<()>>>,
}

type Job = Box<dyn FnOnce() + Send + 'static>;
enum Message {
  DoJob(Job),
  Close,
}

impl ThreadPool {
  pub fn new(size: u32) -> ThreadPool {
    assert!(size > 0);
    let mut handlers = Vec::new();

    let (sender, recv) = channel::<Message>();
    let recv_mut = Mutex::new(recv);
    let recv_arc = Arc::new(recv_mut);

    for id in 0..size {
      handlers.push(Some(worker(id, recv_arc.clone())))
    }

    ThreadPool {
      size,
      sender,
      handlers,
    }
  }

  pub fn exec<F>(&self, f: F)
  where
    F: FnOnce() + Send + 'static,
  {
    self.sender.send(Message::DoJob(Box::new(f))).unwrap();
  }
}

impl Drop for ThreadPool {
  fn drop(&mut self) {
    println!("shutdown begin");
    for _elem in &self.handlers {
      self.sender.send(Message::Close).unwrap();
    }

    for elem in &mut self.handlers {
      if let Some(thread) = elem.take() {
        thread.join().unwrap();
      }
    }
    println!("shutdown end");
  }
}

fn worker(id: u32, recv: Arc<Mutex<Receiver<Message>>>) -> JoinHandle<()> {
  std::thread::spawn(move || loop {
    if let Ok(msg) = recv.lock().unwrap().recv() {
      match msg {
        Message::DoJob(job) => {
          println!("job id {} exec", id);
          job()
        }
        Message::Close => {
          println!("worker {} terminate", id);
          break;
        }
      }
    }
  })
}

pub fn muti_thread_server() {
  let listener = TcpListener::bind("127.0.0.1:7878").unwrap();
  let thread_pool = ThreadPool::new(10);

  let mut count = 0;
  let max = u32::MAX;
  for stream in listener.incoming() {
    let stream: TcpStream = stream.unwrap();
    count += 1;
    if count >= max {
      break;
    }
    println!("Connection established! {}", count);

    thread_pool.exec(move || {
      handle_connection(stream).unwrap();
    })
  }

  drop(thread_pool)
}

fn handle_connection(mut stream: TcpStream) -> std::io::Result<()> {
  let mut buffer = [0; 1204];
  stream.read(&mut buffer)?;
  println!("recv: {}", String::from_utf8_lossy(&buffer));

  let now = SystemTime::now()
    .duration_since(SystemTime::UNIX_EPOCH)
    .unwrap();
  let content = format!(
    r#"
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
    <footer>
    {}
    </footer>
  </html>
  "#,
    now.as_millis()
  );

  let response = format!(
    "HTTP/1.1 200 OK\r\nContent-Length: {}\r\n\r\n{}",
    content.len(),
    content
  );
  stream.write(response.as_bytes())?;
  stream.flush()?;
  Ok(())
}
