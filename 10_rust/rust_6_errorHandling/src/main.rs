use std::fs;

// Result<T, E> is a generic type that represents a value of type T or an error of type E.

// Option<T> is a generic type that represents a value of type T or None.

fn main() {
    let res: Result<String, std::io::Error> = fs::read_to_string("file.txt");
 
   match res {
    Ok(content) => println!("Content: {}", content),
    Err(e) => println!("Error: {}", e),
   }

//  res.unwrap();

 println!("Content:");

 let my_string = String::from("raman");

    match find_first_a(my_string) {
        Some(index) => println!(
            "The letter 'a' is found at index: {}",
            index
        ),
        None => println!(
            "The letter 'a' is not found in the string."
        ),
    }
}

fn find_first_a(s: String) -> Option<i32> {
    for (index, character) in s.chars().enumerate() {
        if character == 'a' {
            return Some(index as i32);
        }
    }

    return None;
}
