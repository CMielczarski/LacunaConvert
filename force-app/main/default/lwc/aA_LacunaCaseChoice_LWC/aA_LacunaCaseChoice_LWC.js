/* eslint-disable no-console */
/* eslint-disable no-alert */
import { LightningElement, api } from 'lwc';

import getChoices from '@salesforce/apex/AA_CaseEntryController.getChoices';
import getGeneral from '@salesforce/apex/AA_CaseEntryController.getGeneral';
import getAfter from '@salesforce/apex/AA_CaseEntryController.getAfter';

export default class AA_LacunaCaseChoice_LWC extends LightningElement {

    @api choiceList = [];
    @api afterHours;
    @api generalCase;
    @api showGeneral = false;
    @api showAfterH = false;
    @api storeID;
    @api showChoice = false;
    @api error;
    @api Spinner = false;

    connectedCallback(){
        this.Spinner = true;
        this.showChoice = true;
        getChoices().then(
                choiceRes=>{
                    this.choiceList = choiceRes;
                    console.log("Loading Choices");
                    getAfter().then(
                        afterRes=>{
                            this.afterHours = afterRes;
                            console.log("Loading After");
                            getGeneral().then(
                                genRes=>{
                                    this.generalCase = genRes;
                                    console.log("Loading General");
                                    this.Spinner = false;
                                    }
                                )
                            .catch(
                                error=>{
                                    this.error = error;
                                    alert("Load Error: " + this.error);
                                    this.Spinner = false;
                                }
                            );
                            }
                    )
                    .catch(
                        error=>{
                            this.error = error;
                            alert("Load Error: " + this.error);
                        }
                    );
                }
            )
        .catch(
            error=>{
                this.error = error;
                alert("Load Error: " + this.error);
                }
            );
        }
    
    openPage(event){
            var id = event.target.name;
            var afterH = this.afterHours;
            var generalC = this.generalCase;
            if(id === afterH){
                this.showChoice = false;
                this.storeID = afterH;
                this.showAfterH = true;
                this.showGeneral = false;
                }
            else if(id === generalC){
                this.showChoice = false;
                this.showAfterH = false;
                this.showGeneral = true;
                }
        }

}