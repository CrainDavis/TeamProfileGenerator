// ===============================================================================
// VARIABLES:
// ===============================================================================
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output") // directory path containing the generated HTML file
const outputPath = path.join(OUTPUT_DIR, "team.html"); // file path for the generated HTML file

const render = require("./lib/htmlRenderer");

let employees = []; // array to hold the manager, engineer(s), and intern(s); will be passed into render() function
let engineer = {}; // object to hold each created engineer
let intern = {}; // object to hold each created intern

// ===============================================================================
// PROMPT RESPONSE VALIDATION:
// ===============================================================================
// prevents user from moving on until something is input
function validateInput(input) {
    return input !== '';
}
// only allows the user to input a number (no letters/special characters)
function validateNumber(number) {
    var reg = /^\d+$/;
    return reg.test(number) || "enter a NUMBER";
}

// ===============================================================================
// PROMPT FUNCTIONS FOR 3 EMPLOYEE ROLES (manager, engineer, intern):
// ===============================================================================
function getManagerInfo() {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "enter the manager's NAME",
            validate: validateInput
        },
        {
            type: "input",
            name: "id",
            message: "enter the manager's ID NUMBER",
            validate: validateNumber
        },
        {
            type: "input",
            name: "email",
            message: "enter the manager's EMAIL ADDRESS",
            validate: validateInput
        },
        {
            type: "input",
            name: "officeNumber",
            message: "enter the manager's OFFICE NUMBER",
            validate: validateInput, validateNumber
        },
        {
            type: "confirm",
            name: "addMore",
            message: "Are there any more team members to be added?",
            default: true
        },
        {
            type: "list",
            name: "newMember",
            message: "Which type of team member do you want to add?",
            choices: ["Engineer", "Intern"],
            when: function(answers) {
                return answers.addMore;
            }
        }
    ])
}

function getEngineerInfo() {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "enter the engineer's NAME",
            validate: validateInput
        },
        {
            type: "input",
            name: "id",
            message: "enter the engineer's ID NUMBER",
            validate: validateNumber
        },
        {
            type: "input",
            name: "email",
            message: "enter the engineer's EMAIL ADDRESS",
            validate: validateInput
        },
        {
            type: "input",
            name: "github",
            message: "enter the engineer's GITHUB USERNAME",
            validate: validateInput
        },
        {
            type: "confirm",
            name: "addMore",
            message: "Are there any more team members to be added?",
            default: true
        },
        {
            type: "list",
            name: "newMember",
            message: "Which type of team member do you want to add?",
            choices: ["Engineer", "Intern"],
            when: function(answers) {
                return answers.addMore;
            }
        }
    ])
}

function getInternInfo() {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "enter the intern's NAME",
            validate: validateInput
        },
        {
            type: "input",
            name: "id",
            message: "enter the intern's ID NUMBER",
            validate: validateNumber
        },
        {
            type: "input",
            name: "email",
            message: "enter the intern's EMAIL ADDRESS",
            validate: validateInput
        },
        {
            type: "input",
            name: "school",
            message: "enter the intern's SCHOOL",
            validate: validateInput
        },
        {
            type: "confirm",
            name: "addMore",
            message: "Are there any more team members to be added?",
            default: true
        },
        {
            type: "list",
            name: "newMember",
            message: "Which type of team member do you want to add?",
            choices: ["Engineer", "Intern"],
            when: function(answers) {
                return answers.addMore;
            }
        }
    ])
}

// ===============================================================================
// FUNCTIONS:
// ===============================================================================
// create ENGINEER(s) based on user's answers to getEngineerInfo() prompt
async function createEngineer() {
    engineer = await getEngineerInfo();
    employees.push(new Engineer(engineer.name, engineer.id, engineer.email, engineer.github));
}

// create INTERN(s) based on user's answers to getInternInfo() prompt
async function createIntern() {
    intern = await getInternInfo();
    employees.push(new Intern(intern.name, intern.id, intern.email, intern.school));
}

// function to compile all employee info and generate HTML page
async function generateHtmlPage() {
    try {
        // create MANAGER based on user's answers to getManagerInfo() prompt
        manager = await getManagerInfo();
        employees.push(new Manager(manager.name, manager.id, manager.email, manager.officeNumber));

        // create a situation (executed with while-loop) for when to allow user to add more engineers/interns
        let addMoreEmployees = true;
        while(addMoreEmployees) {
            // user adds manager, but no other employees
            if (manager.addMore === false) {
                addMoreEmployees = false;
            }
            // user also adds engineer(s)
            if (manager.newMember === "Engineer" || engineer.newMember === "Engineer" || intern.newMember === "Engineer") {
                intern.newMember = manager.newMember = engineer.newMember = "NONE";
                await createEngineer();
                // user stops adding employees
                if (engineer.addMore === false) {
                    addMoreEmployees = false;
                }
            }
            // user also adds intern(s)
            if (manager.newMember === "Intern" || engineer.newMember === "Intern" || intern.newMember === "Intern") {
                intern.newMember = manager.newMember = engineer.newMember = "NONE";
                await createIntern();
                // user stops adding employees
                if (intern.addMore === false) {
                    addMoreEmployees = false;
                }
            }
        }

        console.log("generated employees:", employees);

        // call the render function, passing in the employees array as an argument
        const renderedTeam = render(employees);
        // write file ("team.html" will be generated inside the 'output' directory)
        await fs.writeFile(outputPath, renderedTeam, "utf8", (err) => {
            if (err) throw err;
            console.log("SUCCESS! Your team profiles have been generated.\nGo check the 'output' directory for the 'team.html' file.");
        });
        
    } catch (err) {
        console.log("ERROR!", err);
    }
}

// ===============================================================================
// CALL FUNCTION:
// ===============================================================================
generateHtmlPage();