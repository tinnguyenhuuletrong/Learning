use std::rc::Rc;

#[derive(Debug)]
enum Graph{
  Node(i32),
  Edge(Rc<Graph>, Rc<Graph>)
}

fn main() {
  let n1 = Rc::new(Graph::Node(1));
  let n2 =  Rc::new(Graph::Node(2));
  let n3 =  Rc::new(Graph::Node(3));

  let eg1 = Graph::Edge(n1.clone(), n2.clone());
  let eg2 = Graph::Edge(n2.clone(), n1.clone());
  let eg3 = Graph::Edge(n2.clone(), n3.clone());


  println!("ref count n1 {}", Rc::strong_count(&n1));
  println!("ref count n2 {}", Rc::strong_count(&n2));
  println!("ref count n3 {}", Rc::strong_count(&n3));

  // drop n3
  println!("drop eg3");
  drop(n3);

  println!("ref count n1 {}", Rc::strong_count(&n1));
  println!("ref count n2 {}", Rc::strong_count(&n2));

  // still not drop b/c have edge ref
  if let Graph::Edge(first, second) = eg3 {
    println!("eg3 {:?} -> {:?}", first, second);    
    println!("ref count n3 {}", Rc::strong_count(&second));    
  }
}