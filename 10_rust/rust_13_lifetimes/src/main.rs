#[derive(Debug)]
struct User<'a> {
    first_name: &'a String,
    last_name: &'a String
}

fn main() {
    let first_name: String = String::from("harkirat");
    let mut u: User<'_>;

    {
        let last_name: String = String::from("Singh");

        u = User {
            first_name: &first_name,
            last_name: &last_name
        };
    }

    print!("{:?}", u);

    let s1 = String::from("hello");
    let s2 = String::from("world!!!");

    let result = longest(&s1, &s2);

    println!("{}", result);
}

