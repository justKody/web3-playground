fn main() {
    // mumbers
    let x: i32 = 1;
    let y: u32 = 1000;
    let z: f32 = 1000.001;

    // println!("x: {}",x);
    // println!("y: {}",y);
    // println!("z: {}",z);


    // boolean
    let is_male = true;

    if is_male {
        println!("You ar male");
    }

    // strings
    let greeting: String = String::from("Hello world");
    println!("{}", greeting);

    let char1: Option<char> = greeting.chars().nth(0);


    match char1 {
        Some(c) => println!("{}", c),
        None => println!("No character found")
    }
    // print!("char1: {}", char1) // shows error
    

    // conidtional

    if true {
        println!("The number is even");
    } else if false {
        println!("The number is false");
    }


    // loops
    for i in 0..10 {
        print!("{}", i);
    }


    // iterator
    let mut sentence: String = String::from("My name is smarth");
    sentence.push_str("Wao changed even after ");
    let first_word : String = get_first_word(sentence);

    println!("\n{}", first_word);
}

fn get_first_word(sentence: String) ->String {
     let mut ans: String = String::from("");
    for char in sentence.chars() {
        ans.push(char);
        if char == ' '{
            break;
        }
    }

    return ans;
}
