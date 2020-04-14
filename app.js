// ===============================================================================

const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// ===============================================================================

function managerInfo() {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "enter the manager's NAME"
        },
        {
            type: "input",
            name: "id",
            message: "enter the manager's ID NUMBER"
        },
        {
            type: "input",
            name: "email",
            message: "enter the manager's EMAIL ADDRESS"
        },
        {
            type: "input",
            name: "officeNumber",
            message: "enter the manager's OFFICE NUMBER"
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

function engineerInfo() {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "enter the engineer's NAME"
        },
        {
            type: "input",
            name: "id",
            message: "enter the engineer's ID NUMBER"
        },
        {
            type: "input",
            name: "email",
            message: "enter the engineer's EMAIL ADDRESS"
        },
        {
            type: "input",
            name: "github",
            message: "enter the engineer's GITHUB USERNAME"
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

function internInfo() {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "enter the intern's NAME"
        },
        {
            type: "input",
            name: "id",
            message: "enter the intern's ID NUMBER"
        },
        {
            type: "input",
            name: "email",
            message: "enter the intern's EMAIL ADDRESS"
        },
        {
            type: "input",
            name: "school",
            message: "enter the intern's SCHOOL"
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

// ==============================================================================

var employees = [];

var engineer = {};
var intern = {};

async function pushEngineer() {
    engineer = await engineerInfo();
    employees.push(new Engineer(engineer.name, engineer.id, engineer.email, engineer.github));
}

async function pushIntern() {
    intern = await internInfo();
    employees.push(new Intern(intern.name, intern.id, intern.email, intern.school));
}

async function createHTML() {
    try {
        manager = await managerInfo();
        employees.push(new Manager(manager.name, manager.id, manager.email, manager.officeNumber));

        var addMoreEmployees = true;
        while(addMoreEmployees) {
            if (manager.addMore === false) {
                addMoreEmployees = false;
            }
            if (manager.newMember === "Engineer" || engineer.newMember === "Engineer" || intern.newMember === "Engineer") {
                await pushEngineer();
                if (engineer.addMore === false) {
                    addMoreEmployees = false;
                }
            }
            if (manager.newMember === "Intern" || engineer.newMember === "Intern" || intern.newMember === "Intern") {
                await pushIntern();
                if (intern.addMore === false) {
                    addMoreEmployees = false;
                }
            }
        }
        console.log(employees);

        const renderedTeam = render(employees);
        await fs.writeFile(outputPath, renderedTeam, "utf8", (err) => {
            if (err) throw err;
            console.log("Your team profile page has been successfully generated!");
        });
        
    } catch (err) {
        console.log(err);
    }
}

createHTML();