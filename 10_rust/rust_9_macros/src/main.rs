// declartive macro
macro_rules! say_hello  {
    () => {
        println!("Hello world")
    };
}


// procedural macro

#[derive(Debug, PartialEq)]
struct Rect {
    width: f32,
    height: f32,
}

fn main() {
    
    //declartive macro
    // say_hello!()


    let r = Rect{
        width: 32.0,
        height: 43.1
    };

    let r2 = Rect{
        width: 32.0,
        height: 43.1
    };


    if r == r2 {
        println!("Same")
    } else {
        println!("Not Same")
    }

    print!("{:?}", r );
}