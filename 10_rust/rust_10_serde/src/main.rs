use serde::{Deserialize, Serialize};



#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct Address {
    pin_code: String,
    city_location: String
}

#[derive(Serialize, Deserialize, Debug)]
struct SignupResponse {
    message: String,
    address: Address
}

fn main() {
    let address : Address = Address {
        city_location: String::from("Solan"),
        pin_code: String::from("151232") 
    };

    let s: SignupResponse = SignupResponse {
        message: String::from("You are logged in") ,
        address
    };

    let json_str = serde_json::to_string(&s).unwrap();

    let s2 = serde_json::from_str::<SignupResponse>(&json_str);
    
    println!("{}", json_str);
    println!("{:?}", s2.unwrap());
}
