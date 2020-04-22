import { Command, flags } from "@oclif/command";
import { track, getGlobalNodeModulesPath } from "../utils";
import * as colors from "colors";
const path = require("path");
import { BotonicAPIService } from "../botonicAPIService";

const fs = require("fs");

var AdmZip = require("adm-zip");
export default class Run extends Command {
  static description = "Retrain your model";

  static examples = [
    `$ botonic retrain
    RETRAINING MODEL ...
    `,
  ];

  static flags = {
    lang: flags.string(),
  };

  static args = [];
  private botonicApiService: BotonicAPIService = new BotonicAPIService();

  async run() {
    console.log("Retraining...");

    let resp = await this.botonicApiService.getRetrainData();

    const botonicNLUPath: string = path.join(
      process.cwd(),
      "src",
      "nlu",
      "utterances",
      "en"
    );
    console.log(resp.data);
    if (resp.data.length > 0) {
      resp.data.forEach((element) => {
        element.intent = element.intent + ".txt";
        fs.open(botonicNLUPath + "/" + element.intent, "a", function (err) {
          if (err) throw err;
          fs.appendFileSync(
            botonicNLUPath + "/" + element.intent,
            element.sentence + "\n",
            "UTF-8",
            { flags: "a+" },
            function (err) {
              if (err) throw err;
            }
          );
        });
      });
      const today = new Date();
      const date = today.toUTCString();
      this.botonicApiService.lastRetrainingDate = date;
      this.botonicApiService.beforeExit();
      console.log("YOUR BOT HAS BEEN RETRAINED SUCCESSFULY!!!!");
    } else {
      console.log("There is no new data to retrain!");
    }
  }
}
