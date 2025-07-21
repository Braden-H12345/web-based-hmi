import inquirer from 'inquirer';

async function askPageQuestions() {

  const { pageName, pageIp, plcId } = await inquirer.prompt([
    {
      type: "input",
      name: "pageName",
      message: "What is the name of this HMI page?",
      validate: (input) => input.trim() !== "" || "Page name is required.",
    },
    {
      type: "input",
      name: "pageIp",
      message: "What is the IP of the PLC?",
      validate: (input) => input.trim() !== "" || "IP is required",
    },
          {
        type: "input",
        name: "plcId",
        message: "Enter PLC ID:",
        validate: (input) =>
          /^\d+$/.test(input) ? true : "PLC ID must be a number.",
    }

  ]);


  const components = [];
  let addMore = true;

  while (addMore) {
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "type",
        message: "Select component type:",
        choices: ["MomentaryButton", "ToggleButton", "Indicator"],
      },
      {
        type: "input",
        name: "tag",
        message: "Enter Modbus tag (e.g., 101):",
        validate: (input) =>
          /^\d+$/.test(input) ? true : "Tag must be a number.",
      },
      {
        type: "input",
        name: "label",
        message: "Enter label for this component:",
      },
      {
        type: "list",
        name: "shape",
        message: "Select shape type (default is circle)",
        choices:["circle", "rectangle"],
        when: (answers) => answers.type === 'Indicator',
      }
    ]);

    const config = 
    {
      type: answers.type,
      tag: Number(answers.tag),
      label: answers.label,
      ...(answers.shape && { shape: answers.shape }),
    };

    components.push(config);

    const { continueAdding } = await inquirer.prompt({
      type: "confirm",
      name: "continueAdding",
      message: "Add another component?",
      default: true,
    });

    addMore = continueAdding;
  }

  return { pageName,pageIp,plcId,components};
}

export default askPageQuestions;