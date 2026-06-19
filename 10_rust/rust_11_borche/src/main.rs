// use serde::{Deserialize, Serialize};
use borsh::{BorshSerialize, BorshDeserialize};


#[derive(BorshSerialize, BorshDeserialize, Debug)]
struct User {
    age: u32,
    is_legal: bool,
    name: String,
    city_location: String
}



fn main() {
    let user = User {
        age: 265,
        is_legal: false,
        name: String::from("Smarth verna"),
        city_location: String::from("Solan")
    };

    let mut buffer : Vec<u8> = Vec::new();

    let ans = user.serialize(&mut buffer);

    print!("{:?}", buffer);

    // deserialize borsh -> struct

    let deserialize = User::try_from_slice(&mut buffer).unwrap();

    print!("\n{:?}", deserialize);


}
