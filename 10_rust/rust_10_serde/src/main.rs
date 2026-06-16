use serde::{Deserialize, Serialize}


#[derive(Serialize, Deserialize)]
struct SignupRespose {
    message: String
}

fn main() {
    println!("Hello, world!"); 
}
