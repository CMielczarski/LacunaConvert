/* eslint-disable no-alert */
/* eslint-disable vars-on-top */
/* eslint-disable no-console */
import { LightningElement, api } from 'lwc';

import getAfter from '@salesforce/apex/AA_CaseEntryController.getAfter';

export default class Afterhourscaselwc extends LightningElement {
    @api afterHours;
    @api afterHoursShow = false;
    @api recordId;
    @api pageURL;
    @api recordtypeid;
    @api caseID;

    @api newPt;
    @api newCtc;
    @api newAcc;
    @api fields = ['Patient_First_Name__c','Patient_Last_Name__c','Subject','Patient_DOB__c','AfterHours_Call_Type__c','Patient_Gender__c','Contact_First_Name__c','Patient_Room_Number__c','Contact_Last_Name__c','Patient_Provider__c','Contact_Phone__c','AH_Patient_Status__c','Contact_Type__c','Provider_Notified_Name__c','Location_Type__c','Reason_for_Call__c','Facility_Name__c','Call_Outcome__c','Facility_Type__c','Status','Origin','Priority','Case_Notes__c'];
    
    @api error;

    connectedCallback(){
        console.log("RecordTypeId: " + this.recordtypeid);
        getAfter().then(
            result=>{
            this.afterHours = result;
                    }
                ).catch(
                    error=>{
                        this.error = error;
                        alert("Load error: " + this.error);
                    }
                );
        var ShowResultValue = this.caseID;
        var recordId = this.recordId;
        this.afterHoursShow = true;
        console.log('ID Present1: ' + recordId);
        if(recordId === '' || recordId === null || recordId === undefined){
            console.log('ID present2? ' + ShowResultValue);
            this.recordId = ShowResultValue;
            }
        this.pageURL = window.location.pathname;
        var urlState = this.pageURL;
        console.log('urlState: ' + urlState);
        if(urlState.includes("view")){
            var url = '/lightning/r/Case/' + this.recordId + '/view';
            window.location.replace(url);
            }
        }
    
    onCancel(){
        var url = '/lightning/o/Case/list?filterName=Recent';
        window.location.replace(url);
        }
    
    handleSuccess(event){
        var redUrl ='/lightning/r/Case/' + event.detail.id + '/view';
        window.location.replace(redUrl);
        }

    handleSubmit(event){
        event.preventDefault();
        
        }

}