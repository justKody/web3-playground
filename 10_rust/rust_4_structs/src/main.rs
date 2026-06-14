
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

struct Rect {
    width: u32,
    height: u32,
}

impl Rect {
    
    fn parameter(&self) -> u32 {
        (self.width + self.height) * 2
    }
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

struct NoShape; // unit struct

impl NoShape {
    fn area(&self) -> u32 {
        0
    }

    fn what_am_i() -> &str {
        "I am no shape"
    }
}


struct Point <T> {
    x: T,
    y: T,
}
fn main() {
    let user1 = User {
        active: true,
        username: String::from("user1"),
        email: String::from("user1@example.com"),
        sign_in_count: 1,
    };
    println!("user1: {} sign in count {}", user1.username, user1.sign_in_count);

    let user2 = User {
        active: user1.active,
        username: user1.username,
        email: String::from("user2@example.com"),
        sign_in_count: user1.sign_in_count,
    };
    println!("user2: {} sign in count {}", user2.username, user2.sign_in_count);

    let rect1 = Rect {
        width: 10,
        height: 20,
    };
    println!("parameter {}", rect1.parameter());
    println!("area {}", rect1.area());

    let no_shape = NoShape;
    println!("area {}", no_shape.area());

    let point1: Point<i32> = Point { x: 10, y: 20 };
    println!("x: {}", point1.x);
    println!("y: {}", point1.y);

    println!("what am i? {}", NoShape::what_am_i());
}

