import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase configuration
const supabaseURL = "https://yljmvabqdbrtxgdmtkrs.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlsam12YWJxZGJydHhnZG10a3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2OTMzOTEsImV4cCI6MjAzMTI2OTM5MX0.R3YGPr0iZhQRnvHVQ-SJHpYExCkzwd87aW0La7Xe7sU";
const supabase = createClient(supabaseURL, supabaseKey);

// DOM elements
const button = document.querySelector("button");
const message = document.querySelector("#message");
const inputList = document.querySelector(".inputs");
let isOwner = false; 
let owner; 
const clonedForms = inputList.cloneNode(true);

// Function to check if all fields are filled
function checkFilled() {
    const inputs = inputList.querySelectorAll("input");
    for (let input of inputs) {
        if (input.value.trim() === "") {
            message.textContent = "Error: Please fill all fields.";
            return false;
        }
    }
    return true;
}

// Function to check if the owner exists in the database
async function ownerKnown() {
    const { data, error } = await supabase
        .from("People")
        .select()
        .eq("PersonID", owner);
    
    if (error) {
        message.textContent = `Error: ${error.message}`;
        return false;
    }
    return data.length > 0;
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
function ownerForm() {
    const ownerFields = [
        { label: "Person ID:", id: "personid" },
        { label: "Name:", id: "name" },
        { label: "Address (city):", id: "address" },
        { label: "Date of Birth (yyyy-mm-dd):", id: "dob" },
        { label: "License number:", id: "license" },
        { label: "Expiry date:", id: "expire" }
    ];

    inputList.innerHTML = "";
    ownerFields.forEach(field => {
        const entry = document.createElement("li");
        const label = document.createElement("label");
        const input = document.createElement("input");

        label.setAttribute("for", field.id);
        label.textContent = field.label;
        input.id = field.id;
        input.type = "text";

        entry.appendChild(label);
        entry.appendChild(input);
        inputList.appendChild(entry);
    });

    inputList.parentNode.insertBefore(button,message);

    button.textContent = "Add Owner";
    isOwner = true;
}

// Function to add owner data to the database
async function addOwner() {
    const personID = document.querySelector("#personid").value;
    const name = document.querySelector("#name").value;
    const address = document.querySelector("#address").value;
    const dob = document.querySelector("#dob").value;
    const license = document.querySelector("#license").value;
    const expire = document.querySelector("#expire").value;

    if (personID !== owner) {
        message.textContent = "Error: Person ID does not match the owner.";
        return;
    }

    const { error } = await supabase
        .from("People")
        .insert({ PersonID: personID, Name: name, Address: address, DOB: dob, LicenseNumber: license, ExpiryDate: expire });

    if (error) {
        message.textContent = `Error: Couldn't add owner (${error.message})`;
    } else {
        message.textContent = "Owner added successfully";
        inputList.parentNode.replaceChild(clonedForms, inputList);
        isOwner = false;
    }
}

// Event listener for the button click
button.addEventListener("click", async () => {
    message.textContent = "";
    if (!checkFilled()) return;

    if (isOwner) {
        await addOwner();
    } else {
        owner = document.querySelector("#owner").value;
        await addV();

        if (!await ownerKnown()) {
            await ownerForm();
        }
    }
});
