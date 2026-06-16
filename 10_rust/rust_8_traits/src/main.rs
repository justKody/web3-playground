use std::f32::consts::PI;
use std::fmt::{Display, Formatter, Result};

trait Shape {
    fn area(&self) -> f32;
    fn perimeter(&self) -> f32;
}

struct Rect {
    width: f32,
    height: f32,
}

struct Circle {
    radius: f32,
}

impl Display for Rect {
    fn fmt(&self, f: &mut Formatter<'_>) -> Result {
        write!(
            f,
            "Rect {{ width: {}, height: {} }}",
            self.width,
            self.height
        )
    }
}

impl Shape for Rect {
    fn area(&self) -> f32 {
        self.width * self.height
    }
    fn perimeter(&self) -> f32 {
        2.0 * (self.width + self.height)
    }
}

impl Shape for Circle {
    fn area(&self) -> f32 {
        PI * self.radius * self.radius
    }
    fn perimeter(&self) -> f32 {
        self.radius * 2.0 * PI
    }
}


fn main() {
    let r = Rect {
        width: 10.0,
        height: 20.0,
    };

    println!("{}", r.area());

    println!("{}", r);
}

fn get_perimeter_and_area(s: impl Shape) -> (f32, f32) {
    return (s.area(), s.perimeter());
}

// or


fn get_perimeter_and_area2<T: Shape>(s: T) -> (f32, f32) {
    return (s.area(), s.perimeter());
}

// or

fn get_perimeter_and_area3<T>(s: T) -> (f32, f32) 
where T: Shape
{ 
    return (s.area(), s.perimeter());
}
