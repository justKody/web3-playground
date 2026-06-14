
enum Direction {
    North,
    East,
    South,
    West
}

enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
    Triangle(f64, f64, f64),
}

fn main() {
    let my_direction: Direction = Direction::North;

    move_around(my_direction);

    let my_shape: Shape = Shape::Circle(10.0);
    calculate_area(my_shape);
}

fn move_around(direction: Direction) {
    match direction {
        Direction::North => println!("Moving north"),
        Direction::East => println!("Moving east"),
        Direction::South => println!("Moving south"),
        Direction::West => println!("Moving west"),
    }
}

fn calculate_area(shape: Shape) {
    match shape {
        Shape::Circle(radius) => println!("Area of circle: {}", radius * radius * 3.14),
        Shape::Rectangle(width, height) => println!("Area of rectangle: {}", width * height),
        Shape::Triangle(a, b, c) => println!("Area of triangle: {}", a * b * c),
    }
}