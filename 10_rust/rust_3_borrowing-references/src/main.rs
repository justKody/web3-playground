fn main() {
    let s1 = String::from("Hello");
    let s2 = &s1;

    println!("s2: {}", s2);
    println!("s1: {}", s1);

    let mut my_string = String::from("Hello");
    let len = get_length(&my_string); // sending reference to the function not the ownership
    println!("The length of the string is {}", len);


    let s2 = &my_string; //borrowing the string
    let s3 = &my_string; //borrowing the string
    let s4 = &my_string; //borrowing the string


    // mutatable references
    let s5 = &mut my_string;
    // update_string(&mut my_string);
    // println!("s5: {}", s3);


}

fn get_length(s: &String) -> usize {
    return s.len();
}


fn update_string(s: &mut String) {
    s.push_str(" World");
}

// RUles
// 1. At a time, you can only have one mutable reference to a particular piece of data.
// 2. You can have multiple immutable references to the same piece of data.
