import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase configuration
const supabaseURL = "https://yljmvabqdbrtxgdmtkrs.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsam12YWJxZGJydHhnZG10a3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2OTMzOTEsImV4cCI6MjAzMTI2OTM5MX0.R3YGPr0iZhQRnvHVQ-SJHpYExCkzwd87aW0La7Xe7sU";
const supabase = createClient(supabaseURL, supabaseKey);

// DOM elements
const button = document.querySelector("button");
const message = document.querySelector("#message");
const inputListV = document.querySelector("#vehicleForm");
const inputListO = document.querySelector("#ownerForm");
let isOwner = false; 
let owner; 

// Function to check if all fields are filled
function checkFilled() {
    
    let inputs;

    if(isOwner){
        inputs = inputListO.querySelectorAll("input");
        for (let input of inputs) {
            if (input.value.trim() === "") {
                message.textContent = "Error: Please fill all fields.";
                return false;
            }
        }
        return true;
    }
    else{
        inputs = inputListV.querySelectorAll("input");
        for (let input of inputs) {
            if (input.value.trim() === "") {
                message.textContent = "Error: Please fill all fields.";
                return false;
            }
        }
        return true;
    }
}

// Function to check if the owner exists in the database
async function ownerKnown() {
    const { data, error } = await supabase
        .from("People")
        .select()
        .eq("PersonID", owner);
    
    if (error) {
        message.textContent = `Error: ${error.message}`;
        return true;
    }
    
    if(data.length > 0){
        return true;
    }
    else{
        isOwner = true;
        return false;
    }
}

// Function to add vehicle data to the database
async function addV() {
    const rego = document.querySelector("#rego").value;
    const make = document.querySelector("#make").value;
    const model = document.querySelector("#model").value;
    const colour = document.querySelector("#colour").value;

    const { error } = await supabase
        .from("Vehicles")
        .insert({ VehicleID: rego, Make: make, Model: model, Colour: colour, OwnerID: owner });
    
    if (error) {
        message.textContent = `Error: Couldn't add vehicle (${error.message})`;
    } else {
        message.textContent = "Vehicle added successfully";
    }
}

// Function to set up the owner form
function toggleForms() {
    if(isOwner){
        vehicleForm.style.display = "none";
        ownerForm.style.display = "block";
        button.textContent = "Add Owner";
    }
    else{
        vehicleForm.style.display = "block";
        ownerForm.style.display = "none";
        button.textContent = "Add vehicle";
    }

}


// Function to add owner data to the database
async function addOwner() {
    const personID = document.querySelector("#personid").value;
    const name = document.querySelector("#name").value;
    const address = document.querySelector("#address").value;
    const dob = document.querySelector("#dob").value;
    const license = document.querySelector("#license").value;
    const expire = document.querySelector("#expire").value;

    const { error } = await supabase
        .from("People")
        .insert({ PersonID: personID, Name: name, Address: address, DOB: dob, LicenseNumber: license, ExpiryDate: expire });

    if (error) {
        message.textContent = `Error: Couldn't add owner (${error.message})`;
    } else {
        message.textContent = "Vehicle added successfully";
        isOwner = false;
    }
}

// Event listener for the button click
button.addEventListener("click", async () => {
    message.textContent = "";
    if (!checkFilled()) return;

    if (isOwner) {
        await addOwner();
        await toggleForms();
    } else {
        owner = document.querySelector("#owner").value;
        await addV();

        if (!await ownerKnown()) {
            await toggleForms();
        }
    }
});
