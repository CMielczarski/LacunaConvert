import { LightningElement, api, track } from 'lwc';
 
import aruIcon from '@salesforce/resourceUrl/aruIcon';
import ccIcon from '@salesforce/resourceUrl/ccIcon';
import hhIcon from '@salesforce/resourceUrl/hhIcon';
import hpIcon from '@salesforce/resourceUrl/hpIcon';
import irfIcon from '@salesforce/resourceUrl/irfIcon';
import minusIcon from '@salesforce/resourceUrl/minusIcon';
import plusIcon from '@salesforce/resourceUrl/plusIcon';
import sauIcon from '@salesforce/resourceUrl/sauIcon';
import tccsnfIcon from '@salesforce/resourceUrl/tccsnfIcon';
import tchIcon from '@salesforce/resourceUrl/tchIcon';
import legendIcon from '@salesforce/resourceUrl/legendIcon';
 
import getNewServerCase from '@salesforce/apex/AA_CaseEntryController.getNewServerCase';
import getExistingCase from '@salesforce/apex/AA_CaseEntryController.getExistingCase';
import getExistingContact from '@salesforce/apex/AA_CaseEntryController.getExistingContact';
import getNewServerContact from '@salesforce/apex/AA_CaseEntryController.getNewServerContact';
import getNewServerAccount from '@salesforce/apex/AA_CaseEntryController.getNewServerAccount';
import getExistingAccount from '@salesforce/apex/AA_CaseEntryController.getExistingAccount';
import getNewServerPatient from '@salesforce/apex/AA_CaseEntryController.getNewServerPatient';
import getServerPatient from '@salesforce/apex/AA_CaseEntryController.getServerPatient';
import getNewServerAssessment from '@salesforce/apex/AA_CaseEntryController.getNewServerAssessment';
import getExistingAssessment from '@salesforce/apex/AA_CaseEntryController.getExistingAssessment';
import getServerAge from '@salesforce/apex/AA_CaseEntryController.getServerAge';
import getGeocode from '@salesforce/apex/AA_CaseEntryController.getGeocode';
import getNearByAccounts from '@salesforce/apex/AA_CaseEntryController.getNearByAccounts';
import retreiveFacilityContent from '@salesforce/apex/AA_CaseEntryController.retreiveFacilityContent';
import getNoteHistory from '@salesforce/apex/AA_CaseEntryController.getNoteHistory';
import processSaveItems from '@salesforce/apex/AA_CaseEntryController.processSaveItems';
import processCancelCase from '@salesforce/apex/AA_CaseEntryController.processCancelCase';
import getAttachments from '@salesforce/apex/AA_CaseEntryController.getAttachments';
import cancelReturn from '@salesforce/apex/AA_CaseEntryController.cancelReturn';
import searchFacilities from '@salesforce/apex/AA_CaseEntryController.searchFacilities';
import filterKnowledgeArticles from '@salesforce/apex/AA_CaseEntryController.filterKnowledgeArticles';
import getLacunaFileList from '@salesforce/apex/AA_CaseEntryController.getLacunaFileList';
import getCaseAndNavigate from '@salesforce/apex/AA_CaseEntryController.getCaseAndNavigate';
 
export default class Lacunainterfacelwc extends LightningElement {
 
    aruLogo = aruIcon;
    ccLogo = ccIcon;
    hhLogo = hhIcon;
    hpLogo = hpIcon;
    irfLogo = irfIcon;
    minusImg = minusIcon;
    plusImg = plusIcon;
    sauLogo = sauIcon;
    tccsnfLogo = tccsnfIcon;
    tchLogo = tchIcon;
    legendLogo = legendIcon;
 
    @api points = [];
    @api activeCase;
    @api activePatient;
    @api activeContact;
    @api activeAccount;
    @api activeAssessment;
    @api referralRequired = false;
    @api payorRequired = false;
    @api patientAge = 0;
    @api fromUrl;
    @api subtab = false;
    @api locList = [];
    @api eStatusList = [];
    @api attachmentItems = [];
    @api locationDetails = [];
    @api processObject;
    @api noteBody;
    @api parentID;
    @api currentPhone;
    @api patientLastName;
    @api activeTranscript;
    @api phoneOptions = [];
    @track mapMarkers;
    @api zoomLevel = 16;
    @api showWebInfo = false;
    @api showPatientInfo = false;
    @api showPayorInfo = false;
    @api articleTypeFilter = "All";
    @api articleSearchString = "";
    @api articleList = [];
    @api caseHistory = [];
    @api assessmentHistory = [];
    @api Spinner = false;
    @api recordIdAlt;
    @api requiredPayor = false;
    @api showModalSearch = false;
    @api formReady = false;
    @api callingObject;
    @api chosenFacility;
    @api facilityList = [];
    @api showAccounts = false;
    @api contactGeo;
    @api patientGeo;
    @api facilityTypeList = [];
    @api facilityType;
    @api facilitySelectLocked = false;
    @api fileList = [];
    @api diasbleContentSearch = false;
    @api selAccounts = [];
    @api showContentModal = false;
    @api consentRequired = false;
    @api url;
    @api pageReference;
    @api isEdit = false
    @api accept ="['.jpg', '.jpeg' , '.doc', '.docx', '.pdf', '.msg', '.txt', '.html', '.htm']";
    @api attachParentId;
    @api preferredFacilityName;
    @api lacunaFileList = [];
    @api showFacilityList2  = false;
    @api facilityList2 = [];
    @api displayLegend = false;
    @api formToDisplay;
    @api showForm = false;
    @api disableExtension = false;
    @api map;
    @api mapsPlaceholder;
    @api showWebContent = false;
    @api showAssessmentContent = false;
    @api showPatientContent = false;
    @api showCaseContent = false;
    @api requireEmail = false;
    @api selectedPhone;
    @api showCaseDetails = false;
    @api inputSelectAccount;
    @api getAccSearch = false;
   
    connectedCallback(){
        this.diasbleContentSearch = true;
        this.facilitySelectLocked = true;
        var idCheck = this.recordId;
        this.Spinner = true;
        console.log('idCheck value: ' + idCheck);
        if(idCheck === '' || idCheck === null || idCheck === undefined){
            console.log('Blank ID');
            console.log('Creating Case');
            this.isEdit = false;
            getNewServerCase()
            .then(
                result=>{
                    var repList = result;
                    this.activeCase = repList;
                    this.activeCase.LastName = " ";
                    console.log('activeCase: ' + this.activeCase);
                    this.attachParentId = this.activeCase.Id;
                    console.log('attachParent ID: ' + this.attachParentId);
                    getNewServerContact()
            .then(
                result=>{
                    var repList = result;
                    this.activeContact =  repList;
                    console.log('activeContact: ' + this.activeContact);
                    if(this.activeContact === undefined || this.activeContact === null){
                        this.getNewContact();
                        }
                    else{
                        var street = this.activeContact.MailingStreet;
                        var city = this.activeContact.MailingCity;
                        var state = this.activeContact.MailingState;
                        var phone = this.activeContact.Phone;
                        var email = this.activeContact.Email;
                        var zip = this.activeContact.MailingPostalCode;
                        var firstName = this.activeContact.FirstName;
                        var lastName = this.activeContact.LastName;
                        console.log('firstNameContactNew: ' + firstName);
                        console.log('lastNameContactNew: ' + lastName);  
                    
                        var streetCase = this.activeCase.Web_Street_Address__c;
                        var cityCase = this.activeCase.Web_City__c;
                        var stateCase = this.activeCase.Web_State__c;
                        var phoneCase = this.activeCase.SuppliedPhone;
                        var emailCase = this.activeCase.SuppliedEmail;
                        var zipCase = this.activeCase.Web_Zip_Code__c;
                        var firstNameCase = this.activeCase.Web_First_Name__c;
                        var lastNameCase = this.activeCase.Web_Last_Name__c;
                        console.log('firstNameCaseNew: ' + firstNameCase);
                        console.log('lastNameCaseNew: ' + lastNameCase);
                  
                    if((street === undefined || street === null) && (streetCase !== undefined && streetCase !== null)){
                        this.activeContact.MailingStreet = streetCase;
                        }
                    if((city === undefined || city === null) && (cityCase !== undefined && cityCase !== null)){
                        this.activeContact.MailingCity = cityCase;
                        }
                    if((state === undefined || state === null) && (stateCase !== undefined && stateCase !== null)){
                        this.activeContact.MailingState = stateCase;
                        }
                    if((phone === undefined || phone === null) && (phoneCase !== undefined  && phoneCase !== null)){
                        this.activeContact.Phone = phoneCase;
                        this.currentPhone = phoneCase;
                        }
                    if((email === undefined || email === null) && (emailCase !== undefined && emailCase !== null)){
                        this.activeContact.Email = emailCase;
                        }
                    if((zip === undefined || zip === null) && (zipCase !== undefined && zipCase !== null)){
                        this.activeContact.MailingPostalCode = zipCase;
                        }
                    if((firstName === undefined || firstName === null) && (firstNameCase !== undefined && firstNameCase !== null)){
                        this.activeContact.FirstName = firstNameCase;
                        }
                    if((lastName === undefined || lastName === null || lastName === 'Last Name') && (lastNameCase !== undefined && lastNameCase !== null)){
                        this.activeContact.LastName = lastNameCase;
                        }
                        this.activeCase.ContactId = this.activeContact.Id;
                    }
                    console.log('Populate Account');
                    getNewServerAccount()
                    .then(
                        result=>{
                            var repList = result;
                            this.activeAccount = repList;
                                if(this.activeAccount === undefined || this.activeAccount === null){
                                    this.getNewAccount();
                                    }
                                else{
                                    console.log("New Account: " + this.activeAccount);
                                    this.activeCase.AccountId = this.activeAccount.Id;
                                    this.Spinner = false;
                                    }
                                    console.log('Populate Patient');
        getNewServerPatient({"activeContact" : this.activeContact})
            .then(
                result=>{
                    var repList = result;
                    this.activePatient = repList;
                    if(this.activePatient === undefined || this.activePatient === null){
                        //this.getNewPatient();
                        }
                    else{
                        console.log('activePatient: ' + this.activePatient.Id);
                        this.showPatientInfo = false;
                        this.activePatient.Status__c = "--None--";
                        this.activePatient.Status_Detail__c = "--None--";
                        this.activePatient.Last_Name__c = "";
                        }
                        console.log('activePatient for Assessment: ' + this.activePatient.Id);
        getNewServerAssessment({"activePatient" : this.activePatient})
            .then(
                result=>{
                    var repList = result;
                    this.activeAssessment = repList;
                    if(this.activeAssessment === undefined){
                        this.getNewAssessment();
                        }
                    else{
                        console.log('activeAssessment create: ' + this.activeAssessment.Id);
                        this.showAssessmentContent = true;
                        this.showPayorInfo = false;
                        }
                        this.articleList = null;
                console.log('Finding Articles');
                filterKnowledgeArticles({
                    "articleSearchString" : this.articleSearchString,
                    "articleTypeFilter" : this.articleTypeFilter
                    })
                    .then(
                        result=>{
                            this.articleList = result;
                            this.formReady = true;
                            console.log("Load Complete");
                        }
                    )
                    .catch(
                        error=>{
                            this.Spinner = false;
                            alert("Article List retireval error: " + error.message);
                        }
                    );
                    }
                )
            .catch(
                error=>{
                    this.Spinner = false;
                    console.log("Error in fetching/creating Assessment: " + error.message);
                    this.getNewAssessment();
                    }
                );
                    }
                )
            .catch(
                error=>{
                    this.Spinner = false;
                    console.log("Error in fetching/creating Patient: " + error.message);
                    this.getNewPatient();
                    }
                );
                            }
                        )
                    .catch(
                        error=>{
                            this.Spinner = false;
                            console.log("Error in creating Account: " + error.message);
                            this.getNewAccount();
                            }
                        );    
                }
            )
            .catch(
                error=>{
                    this.Spinner = false;
                    console.log("Error in creating Contact: " + error.message);
                    this.getNewContact();
                }
            );
                    }
                )
            .catch(
                error=>{
                    this.Spinner = false;
                    console.log("Error in fetching/creating case: " + error.message);
                    this.getNewCase();
                    }
            );
            }
        else{
            console.log('Load existing Case');
            console.log('Fetching Case');
            this.isEdit = true;
        console.log('Populate Existing Case');
        getExistingCase({"recordId" : this.recordId})
        .then(
            result=>{
                var repList = result;
                    this.activeCase = repList;
                    console.log('activeCase: ' + this.activeCase);
                    this.attachParentId = this.activeCase.Id;
                    /*try{
                        var loc = this.activeCase.Level_Of_Care__c;
                        if(loc !== undefined && loc !== null){
                            component.find("accType").set("v.value",loc);
                            }
                        }
                    catch(errLoc){
                       
                        }*/
 
                    try{
                        var desc = this.activeCase.Description;
                        if (desc !== undefined && desc !== null){
                            component.find("caseDescription").set("v.value", desc);
                            this.activeCase.Case_Notes__c = desc;
                            }
                        }
                    catch(errDesc){
                      
                        }
                  
                    console.log('attachParent ID: ' + this.attachParentId);
                    console.log('Populate existing Contact');
                    console.log('case contactID: ' + this.activeCase.ContactId);
                   
                    getExistingContact({"activeCase" : this.activeCase})
                        .then(
                            result=>{
                                var repList = result;
                                this.activeContact = repList;
                                if(this.activeContact === undefined || this.activeContact === null){
                                    this.getNewContact();
                                    }
                                else{
                                    if(this.activeContact !== null && this.activeContact !== undefined){
                                        var street = this.activeContact.MailingStreet;
                                        var city = this.activeContact.MailingCity;
                                        var state = this.activeContact.MailingState;
                                        var phone = this.activeContact.Phone;
                                        console.log('Contact Phone: ' + phone);
                                        var email = this.activeContact.Email;
                                        var zip = this.activeContact.MailingPostalCode;
                                        var firstName = this.activeContact.FirstName;
                                        var lastName = this.activeContact.LastName;
                                        console.log('firstNameContactExisting: ' + firstName);
                                        console.log('lastNameContactExisting: ' + lastName);  
                               
                                        var facility = this.activeContact.Facility__r.Name;
                                        if(facility !== undefined && facility !== null){
                                            this.chosenFacility = facility;
                                            }      
                                
                                        var streetCase = this.activeCase.Web_Street_Address__c;
                                        var cityCase = this.activeCase.Web_City__c;
                                        var stateCase = this.activeCase.Web_State__c;
                                        var phoneCase = this.activeCase.SuppliedPhone;
                                        var emailCase = this.activeCase.SuppliedEmail;
                                        var zipCase = this.activeCase.Web_Zip_Code__c;
                                        var firstNameCase = this.activeCase.Web_First_Name__c;
                                        var lastNameCase = this.activeCase.Web_Last_Name__c;
                                            console.log('firstNameCaseExisting: ' + firstNameCase);
                                            console.log('lastNameCaseExisting: ' + lastNameCase);
                                        try{
                                            var eStatus = this.activeContact.Email_Status__c;
                                            if(eStatus !== undefined && eStatus !== null){
                                                component.find("inputEmailStatus").set("v.value", eStatus);
                                                }
                                            }
                                    catch(err){
             
                                               }
                              
                                        if((street === undefined || street === null) && (streetCase !== undefined && streetCase !== null)){
                                            this.activeContact.MailingStreet = streetCase;
                                            }
                                        if((city === undefined || city === null) && (cityCase !== undefined && cityCase !== null)){
                                            this.activeContact.MailingCity = cityCase;
                                            }
                                        if((state === undefined || state === null) && (stateCase !== undefined && stateCase !== null)){
                                            this.activeContact.MailingState = stateCase;
                                            }
                                        if((phone === undefined || phone === null) && (phoneCase !== undefined  && phoneCase !== null)){
                                            this.activeContact.Phone = phoneCase;
                                            this.currentPhone = phoneCase;
                                            }
                                        if((email === undefined || email === null) && (emailCase !== undefined && emailCase !== null)){
                                            this.activeContact.Email = emailCase;
                                            }
                                        if((zip === undefined || zip === null) && (zipCase !== undefined && zipCase !== null)){
                                            this.activeContact.MailingPostalCode = zipCase;
                                            }
                                        if((firstName === undefined || firstName === null) && (firstNameCase !== undefined && firstNameCase !== null)){
                                            this.activeContact.FirstName = firstNameCase;
                                            }
                                        if((lastName === undefined || lastName === null || lastName === 'Last Name') && (lastNameCase !== undefined && lastNameCase !== null && lastNameCase !== 'Last Name')){
                                            this.activeContact.LastName = lastNameCase;
                                            }  
                                            }
                                            this.activeCase.ContactId = this.activeContact.Id;
                                            this.evalEmailStatus();
                                            }
                                            console.log('Populate Account');
                                            getExistingAccount({"activeCase" : this.activeCase, "activeContact" : this.activeContact})
                                                .then(
                                                    result=>{
                                                        var repList = result;
                                                        this.activeAccount = repList;
                                                        console.log('activeAccount: ' + this.activeAccount);
                                                        this.activeCase.AccountId = this.activeAccount.Id;
        console.log('Populate Patient');
        getServerPatient({"activeCase" : this.activeCase})
            .then(
                result=>{
                        var repList = response;
                        this.activePatient = repList;
                        console.log('activePatient: ' + this.activePatient.Id);
                        this.showPatientInfo = true;
                        var lastName = this.activePatient.Last_Name__c;
                        var firstName = this.activePatient.First_Name__c;
                        var street = this.activePatient.Street__c;
                        var city = this.activePatient.City__c;
                        var state = this.activePatient.State__c;
                        var zip = this.activePatient.Postal_Code__c;
                        var email = this.activePatient.E_mail__c;
                        var phone = this.activePatient.Phone__c;
                        var age = this.activePatient.Age__c;
                        console.log('Patient Age: ' + age);
                        var edit = this.isEdit;
                   
                        if(edit === true){
                            if(lastName !== undefined && lastName !== 'temp'){
                                component.find("plNameEdit").set("v.value", lastName);
                                }
                            }
                    if(lastName === 'temp'){
                        this.showPatientInfo = false;
                        }
                    if(firstName !== undefined){
                        component.find("pfName").set("v.value", firstName);
                        }
                    if(street !== undefined){
                        component.find("ptStreet").set("v.value", street);
                        }
                    if(city !== undefined){
                        component.find("ptCity").set("v.value", city);
                        }
                    if(state !== undefined){
                        component.find("ptState").set("v.value", state);
                        }
                    if(zip !== undefined){
                        component.find("ptZip").set("v.value", zip);
                        }
                    if(email !== undefined){
                        component.find("pEmail").set("v.value", email);
                        }
                    if(phone !== undefined){
                        component.find("pPhone").set("v.value", phone);
                        }
                    if(age !== undefined){
                        this.patientAge = age;
                        }
        getExistingAssessment({"activePatient" : this.activePatient})
            .then(
                result=>{
                    var repList = result;
                    this.activeAssessment = repList;
                    console.log('activeAssessment get: ' + this.activeAssessment.Id);
                    try{
                        var payorName = this.activeAssessment.Payor__c;
                       
                        if(payorName !== undefined && payorName.length > 1){
                            this.showPayorInfo = true;
                            }
                        else{
                            this.showPayorInfo = false;
                            }
                        }
                    catch(errStart){
                        this.showPayorInfo = false;
                        }
                    try{
                        var prefFac = this.activeAssessment.Preferred_Facility__c;
                        }
                    catch(err){
                      
                        }
                    if(prefFac !== null && prefFac !== undefined){
                        this.preferredFacilityName = this.activeAssessment.Preferred_Facility__r.Name;
                        }
                    try{
                        var payName = this.activeAssessment.Payor__c;
                        }
                    catch(err2){
                      
                        }
                    try{
                        var memID = this.activeAssessment.Member_ID__c;
                        }
                    catch(err3){
                        var subName = this.activeAssessment.Subscriber_Name__c;
                        }
                    try{
                        var payName2 = this.activeAssessment.Secondary_Payor__c;
                        }
                    catch(err4){
                      
                        }
                    try{
                        var memID2 = this.activeAssessment.Secondary_Member_ID__c;
                        }
                    catch(err5){
                        var subName2 = this.activeAssessment.Secondary_Subscriber_Name__c;
                        }
                    this.showAssessmentContent = true;
                    getNoteHistory({"id" : this.activeCase.Id})
                    .then(
                        result=>{
                            var repList = result;
                            this.caseHistory = repList;
                            console.log('caseHistory: ' + this.caseHistory);
                            }
                        )
                    .catch(
                        error=>{
                            this.Spinner = false;
                            console.log("Error in fetching case history: " + error.message);
                            }
                        );
                    }
                )
            .catch(
                error=>{
                    this.Spinner = false;
                    console.log("Error in fetching/creating Assessment: " + error.message);
                    }
                );
                        }
                    )
            .catch(
                error=>{
                    this.Spinner = false;
                    console.log("Error in fetching/creating Patient: " + error.message);
                    }
                );
                                                        }
                                                    )
                                                .catch(
                                                    error=>{
                                                        this.Spinner = false;
                                                        console.log("Error in fetching Account: " + error.message);
                                                        }
                                                    );
                                    }
                                )
                        .catch(
                            error=>{
                                this.Spinner = false;
                                console.log("Error in fetching Contact: " + error.message);
                            }
                        );
                }
                )
        .catch(
            error=>{
                this.Spinner = false;
                console.log("Error in fetching case: " + error.message);
                this.getCase();
                }
            );
            }

        getLacunaFileList().then(
            response=>{
                var repList = response;
                this.lacunaFileList = repList;
                }
                )
            .catch();
                error=>{
                this.Spinner = false;
                console.log("File List fetch Error: " + error);
                }

        this.Spinner = false;
        }

        hideFormModal(){
            this.showForm = false;
            }
      
        showLegend(){
            this.displayLegend = true;
            }
      
        hideLegend(){
            this.displayLegend = false;
            }
       
        hideContentModal(){
            this.showContentModal = false;
            }
      
        hideAccountModal(){
            this.showAccounts = false;
            }
      
        hideAccountModal2(){
            this.showFacilityList2 = false;
            }
      
        setFacility(event){
            var id = event.target.text;
            console.log("id: " + id);
            var name = event.target.name;
            console.log('name: ' + name);
            this.activeContact.Facility__c =  id;
            console.log('Contact Facility: ' + this.activeContact.Facility__c);
            this.chosenFacility = name;
            this.showAccounts = false;
            }
      
        setFacility2(event){
            var id = event.target.text;
            console.log("id: " + id);
            var name = event.target.name;
            console.log('name: ' + name);
            this.activeAssessment.Preferred_Facility__c= id;
            console.log('Assessment Facility: ' + this.activeAssessment.Preferred_Facility__c);
            this.preferredFacilityName = name;
            this.showFacilityList2 = false;
            }
      
        showHideWeb(){
            var state = this.showWebInfo;
            if(state === false){
                this.showWebInfo = true;
                }
            else{
               this.showWebInfo = false;
                }
            }
      
        copyContactToPatient(){
            var lastName = this.activeContact.LastName;
            var firstName = this.activeContact.FirstName;
            var street = this.activeContact.MailingStreet;
            var city = this.activeContact.MailingCity;
            var state = this.activeContact.MailingState;
            var zip = this.activeContact.MailingPostalCode;
            var email = this.activeContact.Email;
            var phone = this.currentPhone;
          
            if(lastName !== undefined){
                var edit = this.isEdit;
                this.activePatient.Last_Name__c;
                console.log('Copy to Patient LName: ' + lastName);
                this.patientLastName = lastName;
                }
            if(firstName !== undefined){
                this.activePatient.First_Name__c = firstName;
                }
            if(street !== undefined){
                this.activePatient.Street__c = street;
                }
            if(city !== undefined){
                this.activePatient.City__c = city;
                }
            if(state !== undefined){
                this.activePatient.State__c = state;
                }
            if(zip !== undefined){
                this.activePatient.Postal_Code__c = zip;
                }
            if(email !== undefined){
                this.activePatient.E_mail__c = email;
                }
            if(phone !== undefined){
                this.activePatient.Phone__c = phone;
                }
          
            this.showPatientInfo = false;
            this.showPatientInfo = true;
            }
      
        showHidePatient(){
            var patient = this.activePatient.Id;
            console.log("patientID present?: " + patient);
            var isEdit = this.isEdit;
           
            if((patient === undefined || patient === null) && isEdit === false){
                this.getNewPatient();
                }
            var state = this.showPatientInfo;
            console.log('Button State: ' + state);
            if(state === false){
                this.showPatientInfo = true;
                }
            else{
                this.showPatientInfo = false;
                }
            }
      
        showHidePayor(){
            var assessment = this.activeAssessment.Id;
            var isEdit = this.isEdit;
            console.log("assessmentID present?: " + assessment);
            if((assessment === undefined || assessment === null) && isEdit === false){
                this.getNewAssessment();
                }
            var state = this.showPayorInfo;
            console.log('Button State: ' + state);
            if(state === false){
                this.showPayorInfo = true;
                }
            else{
                this.showPayorInfo = false;
            }
        }
      
        getAgeCalc(){
            getServerAge({"birthDate" : this.activePatient.Date_of_Birth__c})
            .then(
                result=>{
                    this.patientAge = result;
                    this.activePatient.Age__c = result;
                    }
            ).catch(
                error=>{
                    alert("Age Calculation error: " + error);
                    }
                );
            }
      
        searchFacilties(){
            this.Spinner = true;
            this.facilityList = null;
            searchFacilities({"searchString" : this.chosenFacility})
            .then(
                result=>{
                    this.facilityList = result;
                    this.showAccounts = true;
                    this.Spinner = false;
                }
                )
                .catch(
                    error=>{
                        alert("Search facility error: " + error);
                    }
                );
            }
      
        searchFacilties2(){
            this.Spinner = true;
            this.facilityList2 = null;
            searchFacilities({"searchString" : this.preferredFacilityName})
            .then(
                result=>{
                    this.facilityList2 = result;
                    this.showFacilityList2 = true;
                    this.Spinner = false;
                }
               )
                .catch(
                    error=>{
                        alert("Search facility error: " + error);
                    }
                );
            }
      
        setPreferredFac(){
            var facID = event.targer.text;
            var state = event.target.value;
            var name = event.target.name;
            if(state === true){
                this.activeAssessment.Preferred_Facility__c = facID;
                this.preferredFacilityName = name;
                }
            else{
                this.activeAssessment.Preferred_Facility__c = null;
                this.preferredFacilityName = "";
                }
            }
      
        recenterMap(){
            var proceed = this.formReady;
            if(proceed === true){
            var map = component.find("mapComponent");
            var loc = event.target.title;
          
            var cityAddr = loc.City;
            var zipAddr = loc.PostalCode;
            var stateAddr = loc.State;
            var streetAddr = loc.Street;
              
            var repList = this.locationDetails;
            console.log('Resetting Map');
            var mapComponent = component.find('mapComponent');
                            if(mapComponent && mapContainer !== undefined){
                                mapComponent.destroy();
                                }
                            var mapContainer = component.find('mapContainer');
                            if(mapContainer){
                                this.mapContainer.body = "";
                                }
                            var mapBody = this.mapContainer.body;
                          
                            var center = {
                                location:
                                {
                                    City: cityAddr,
                                    Country: 'USA',
                                    PostalCode: zipAddr,
                                    State: stateAddr,
                                    Street: streetAddr
                                }
                            };
                  
                    if(center !== undefined && repList !== undefined){
                            /*$A.createComponent(
                                "lightning:map",
                                {
                                    "aura:id" : 'mapComponent',
                                    "mapMarkers" : repList,
                                    "zoomLevel" : 8,
                                    "center" : center,
                                    "markersTitle" : "Kindred Accounts"
                                },
                                function(lightningMap){
                                    mapBody.push(lightningMap);
                                    mapContainer.set("v.body", mapBody);
                                }
                            );*/
                        }
                }
            }
      
            handleFormInputChange(event){
                var conZip;
                var conState;
                var conCity;
                var conStreet;
 
                var ptStreet;
                var ptCity;
                var ptState;
                var ptZip;
 
                var proceed = this.formReady;
                console.log('Event Caused by: ' + event.target.name);
                if (event.target.name === 'contactPhoneSelect'){
                    this.selectedPhone = event.target.value;
                    }
                else if (event.target.name === 'cPhone'){
                    var phoneType = this.selectedPhone;
                    console.log('phoneType: ' + event.target.value);
                    var phoneNumberString = event.target.value;
                    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
                    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                    if(match !== null){
                        match = '(' + match[1] + ') ' + match[2] + '-' + match[3];
                        } 
                        if(phoneType === 'Phone'){
                            this.activeContact.Phone = match;
                            console.log('Phone: ' + this.activeContact.Phone);
                            this.currentPhone = this.activeContact.Phone;
                            this.disableExtension = false;
                            }
                        else if(phoneType === 'Home Phone'){
                            this.activeContact.HomePhone = match;
                            console.log('HomePhone: ' + this.activeContact.HomePhone);
                            this.currentPhone = this.activeContact.HomePhone;
                            this.disableExtension = true;
                            }
                        else if(phoneType === 'Mobile'){
                            this.activeContact.MobilePhone = match;
                            console.log('MobilePhone: ' + this.activeContact.MobilePhone);
                            this.currentPhone = this.activeContact.MobilePhone;
                            this.disableExtension = true;
                            }
                        else if(phoneType === 'Other'){
                            this.activeContact.OtherPhone = match;
                            console.log('OtherPhone: ' + this.activeContact.OtherPhone);
                            this.currentPhone = this.activeContact.OtherPhone;
                            this.disableExtension = true;
                            }
                    }
                else if(event.target.name === 'inputSelectFacility'){
                    var fac = event.target.value;
                    if(fac === '--None--'){
                        this.facilityType = null;
                        this.searchNearAccounts();
                        }
                    else{
                        this.facilityType = fac;
                        this.searchNearAccounts();
                        }
                    }
                else if(event.target.name === 'inputSelectAccount'){
                    this.inputSelectAccount = event.target.value;
                    }
                else if(event.target.name === 'fName'){
                    this.activeContact.FirstName = event.target.value;
                    }
                else if(event.target.name === 'lName'){
                    this.activeContact.LastName = event.target.value;
                    }
                else if(event.target.name === 'phoneExt'){
                    this.activeContact.Extension__c = event.target.value;
                    }
                else if(event.target.name === 'conStreet'){
                    conStreet = event.target.value;
                    this.activeContact.MailingStreet = conStreet;
                    this.callingObject = "contact";
                    }
                else if(event.target.name === 'conCity'){
                    conCity = event.target.value;
                    this.activeContact.MailingCity = conCity;
                    this.callingObject = "contact";
                    }
                else if(event.target.name === 'conState'){
                    conState = event.target.value;
                    this.activeContact.MailingState = conState;
                    this.callingObject = "contact";
                    }
                else if(event.target.name === 'conZip'){
                    conZip = event.target.value;
                    this.activeContact.MailingPostalCode = conZip;
                    this.callingObject = "contact";
                    }
                else if(event.target.name === 'ptStreet'){
                    ptStreet = event.target.value;
                    this.activePatient.Street__c = ptStreet;
                    this.callingObject = "patient";
                    }
                else if(event.target.name === 'ptCity'){
                    ptStreet = event.target.value;
                    this.activePatient.City__c = ptCity;
                    this.callingObject = "patient";
                    }
                else if(event.target.name === 'ptState'){
                    ptState = event.target.value;
                    this.activePatient.State__c = ptState;
                    this.callingObject = "patient";
                    }
                else if(event.target.name === 'ptZip'){
                    ptZip = event.target.value;
                    this.activePatient.Postal_Code__c = ptZip;
                    this.callingObject = "patient";
                    }
                else if(event.target.name === 'inputSelectType'){
                    if(proceed === true){
                        var subj = event.target.value;
                        this.activeCase.Type =subj;
                        this.activeCase.Subject = subj;
                        }
                    }
                else if(event.target.name === 'inputSelectSubType'){
                    if(proceed === true){
                        var subj = event.target.value;
                        this.activeCase.Subtype__c = subj;
                        this.activeCase.Subject = this.activeCase.Subject + ' - ' + subj;
                        var typeSel = subj;
                        console.log('SubType Selection: ' + typeSel);
                            if(typeSel === 'Service Recommendation' || typeSel === 'Service Recommendation w/ Orders'){
                                this.showPatientInfo = true;
                                this.showPayorInfo = true;
                                }
                            else if(typeSel === 'Lead'){
                                this.showPatientInfo = true;
                                }
                            else{
                                this.showPatientInfo = false;
                                this.showPayorInfo = false;
                                }
                            }
                        }
                else if(event.target.name === 'contactEmailStatus'){
                    var eStatus = event.target.value;
                    this.activeContact.Email_Status__c = eStatus;
                    if(eStatus === 'Valid'){
                        this.requireEmail = false;
                        }
                    else{
                        this.requireEmail = true;
                    }
                    }
                else if(event.target.name === 'inputEmail'){
                    this.activeContact.Email = event.target.value;
                    }
                else if(event.target.name === 'inputConFac'){
                    this.chosenFacility = event.target.value;
                    }
                else if(event.target.name === 'pfName'){
                    this.activePatient.First_Name__c = event.target.value;
                    }
                else if(event.target.name === 'pfMidName'){
                    this.activePatient.Middle_Initial__c = mName;
                    }
                else if(event.target.name === 'plNameEdit' || event.target.name === 'plName'){
                    this.activePatient.Last_Name__c = event.target.value;
                    this.patientLastName = event.target.value;
                    }
                else if(event.target.name === 'pfSufName'){
                    this.activePatient.Suffix__c = event.target.value;
                    }
                else if(event.target.name === 'InputDOB'){
                    try{
                        var dob = event.target.value;
                        console.log('1st dob check: ' + dob);
                        if(dob !== undefined){
                            var pattern =/^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})$/;
                            var pattern2 =/^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})$/;
                            if(dob == null || dob == "" || (!pattern.test(dob) && !pattern2.test(dob))){
                                console.log('DOB: ' + dob);
                                }
                            }
                       }
                   catch(errDte){
                        alert("Invalid date of birth.  Check entry and retry.  Format should be in: mm/dd/yyyy");
                        }
                        this.activePatient.Date_of_Birth__c = event.target.value;
                    }
                else if(event.target.name === 'pSex'){
                    this.activePatient.Sex__c = event.target.value;
                    }
                else if(event.target.name === 'pEmail'){
                    this.activePatient.E_mail__c = event.target.value;
                    }
                else if(event.target.name === 'pPhone'){
                    var phoneNumberString = event.target.value;
                    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
                    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                    if(match != null){
                        match = '(' + match[1] + ') ' + match[2] + '-' + match[3];
                        }
                    this.activePatient.Phone__c = match;
                    }
                else if(event.target.name === 'ptStreet'){
                    this.activePatient.Street__c = event.target.value;
                    }
                else if(event.target.name === 'ptCity'){
                    this.activePatient.City__c = event.target.value;
                    }
                else if(event.target.name === 'ptCity'){
                    this.activePatient.City__c = event.target.value;
                    }
                else if(event.target.name === 'ptState'){
                    this.activePatient.State__c = event.target.value;
                    }
                else if(event.target.name === 'ptZip'){
                    this.activePatient.Postal_Code__c = event.target.value;
                    }
                else if(event.target.name === 'inputPtStatus'){
                    this.activePatient.Status__c = event.target.value;
                    }
                else if(event.target.name === 'inputPtStatusDetail'){
                    this.activePatient.Status_Detail__c = event.target.value;
                    }
                else if(event.target.name === 'inputPtConsent'){
                    this.activePatient.Consent_for_Callback__c = event.target.value;
                    }
                else if(event.target.name === 'pNextCall'){
                   this.activePatient.Next_Call_Date__c = event.target.value;
                    }
                else if(event.target.name === 'pLeadLost'){
                    this.activePatient.Lead_Lost_Date__c = event.target.value;
                    }
                else if(event.target.name === 'payorName'){
                    this.activeAssessment.Payor__c = event.target.value;
                    }
                else if(event.target.name === 'payorName'){
                    this.activeAssessment.Payor__c = event.target.value;
                    }
                else if(event.target.name === 'payorMemberId'){
                    this.activeAssessment.Member_ID__c = event.target.value;
                    }
                else if(event.target.name === 'payorSubscriberName'){
                    this.activeAssessment.Subscriber_Name__c = event.target.value;
                    }
                else if(event.target.name === 'payorName2'){
                    this.activeAssessment.Secondary_Payor__c = event.target.value;
                    }
                else if(event.target.name === 'payorMemberId2'){
                    this.activeAssessment.Secondary_Member_ID__c = event.target.value;
                    }
                else if(event.target.name === 'payorSubscriberName2'){
                    this.activeAssessment.Secondary_Subscriber_Name__c = event.target.value;
                    }
                else if(event.target.name === 'accType'){
                    if(event.target.value !== '--None--'){
                        this.activeAccount.Type = event.target.value;
                        this.activeCase.Level_Of_Care__c = event.target.value;
                        }
                    }
                else if(event.target.name === 'webAdAsk'){
                    this.activeCase.Website_Ad_Ask__c = event.target.value;
                    }
                else if(event.target.name === 'tvAdAsk'){
                    this.activeCase.TV_Ad_Ask__c = event.target.value;
                    }
                else if(event.target.name === 'onlineSearchAsk'){
                    this.activeCase.Online_Search_Ask__c = event.target.value;
                    }
                else if(event.target.name === 'caseSource'){
                    this.activeCase.Case_Source__c = event.target.value;
                    }
                else if(event.target.name === 'caseOrigin'){
                    this.activeCase.Origin = event.target.value;
                    }
                else if(event.target.name === 'inputSelectCallType'){
                    this.activeCase.Call_Type__c = event.targer.value;
                    }
                else if(event.target.name === 'inputEmailStatus'){
                    var eStatus = event.target.value;
                    this.activeContact.Email_Status__c = eStatus;
                    if(eStatus === 'Valid'){
                        this.requireEmail = false;
                        }
                    else{
                        this.requireEmail = true;
                        }
                    }
                else if(event.target.name === 'caseStatus'){
                    this.activeCase.Status = event.target.value;
                    }
                else if(event.target.name === 'caseDescription'){
                    this.activeCase.Case_Notes__c = event.target.value;
                    }

                if((conCity !== undefined || conState !== undefined || conZip !== undefined) && this.callingObject === "contact"){
                    console.log('Fetching Accounts near Contact');
                    getGeocode({
                        "streetAddr" : conStreet,
                        "cityAddr" : conCity,
                        "stateAddr" : conState,
                        "zipAddr" : conZip
                        })
                    .then(
                        result=>{
                            var repList = result;
                            this.contactGeo = repList;
                            console.log('contactGeo: ' + this.contactGeo);
                            this.getAccSearch = true;
                            }
                        )
                    .catch(
                        error=>{
                            console.log("Error in fetching Geocode." + error.message);
                            }
                        );
                    }
            
                if((ptZip !== undefined && (ptState !== undefined  && ptState.length == 2)) && this.callingObject === "patient"){
                    getGeocode({
                        "streetAddr" : ptStreet,
                        "cityAddr" : ptCity,
                        "stateAddr" : ptState,
                        "zipAddr" : ptZip
                        })
                    .then(
                        result=>{
                                var repList = result;
                                this.patientGeo = repList;
                                console.log('patientGeo: ' + this.patientGeo);
                                this.getAccSearch = true;
                        }
                        )
                        .catch(
                            error=>{
                                console.log("Error in fetching Geocode." + error.message);
                                }
                            );
                        }

                if(this.getAccSearch === true){
                    this.locationDetails =  null;
                                var streetAddr;
                                var cityAddr;
                                var stateAddr;
                                var zipAddr;
                                var geolocation;
                                var accType = this.facilityType;
                                console.log('Chosen facility type: ' + accType);
                                var initialProcess = this.callingObject;
                                console.log("callingObject for Markers: " + initialProcess);
                                if(this.callingObject === "patient"){
                                    streetAddr = this.activePatient.Street__c;
                                    cityAddr = this.activePatient.City__c;
                                    stateAddr = this.activePatient.State__c;
                                    zipAddr = this.activePatient.Postal_Code__c;
                                    geolocation = this.patientGeo;
                                    }
                                else{
                                    streetAddr = this.activeContact.MailingStreet;
                                    cityAddr = this.activeContact.MailingCity;
                                    stateAddr = this.activeContact.MailingState;
                                    zipAddr = this.activeContact.MailingPostalCode;
                                    geolocation = this.contactGeo;
                                    }
                                console.log('streetAddr: ' + streetAddr);
                                console.log('cityAddr: ' + cityAddr);
                                console.log('stateAddr: ' + stateAddr);
                                console.log('zipAddr: ' + zipAddr);
                                console.log('geolocation: ' + geolocation);
                                if(geolocation !== undefined){
                                    getNearByAccounts({
                                                        "city" : cityAddr,
                                                        "state" : stateAddr,
                                                        "zipCode" : zipAddr,
                                                        "loc" : geolocation,
                                                        "accType" : accType
                                                        }
                                                        )
                                    .then(
                                        response=>{
                                            try{
                                            var repList = response;
                                                if(response !== null && response !== undefined){
                                                    this.locationDetails = repList;
                                                    var mapComponent = component.find('mapComponent');
                                                if(mapComponent && mapContainer !== undefined){
                                                    mapComponent.destroy();
                                                    }
                                                var mapContainer = component.find('mapContainer');
                                                if(mapContainer){
                                                    mapContainer.body = "";
                                                    }
                                                var mapBody = mapContainer.body;
                                                    var center;
                                                if(cityAddr !== undefined && zipAddr !== undefined && stateAddr !== undefined && stateAddr.length === 2){
                                                    if(streetAddr === undefined){
                                                        streetAddr = '123 St';
                                                        }
                                                    console.log('Center with address');
                                                    center = {
                                                        location:
                                                                {
                                                                City: cityAddr,
                                                                Country: 'USA',
                                                                PostalCode: zipAddr,
                                                                State: stateAddr,
                                                                Street: streetAddr
                                                                }
                                                            };
                                                    }
                                                else{
                                                    console.log('Center from geolocation');
                                                    console.log('lat: ' + parseFloat(geolocation.split(",")[0]));
                                                    console.log('lng: ' + parseFloat(geolocation.split(",")[1]));
                                                    center =
                                                            {
                                                            'lat': parseFloat(geolocation.split(",")[0]),
                                                            'lng': parseFloat(geolocation.split(",")[1])
                                                            }
                                                    }
                                                    console.log('Map center: Lat:' + center.lat + ' Lng:' + center.lng);
                                                if(center != null && center != undefined){
                                            /*$A.createComponent(
                                                "lightning:map",
                                                            {
                                                    "aura:id" : 'mapComponent',
                                                    "mapMarkers" : repList,
                                                    "zoomLevel" : 8,
                                                    "center" : center,
                                                    "markersTitle" : "Kindred Accounts"
                                                            },
                                                function(lightningMap){
                                                    mapBody.push(lightningMap);
                                                    mapContainer.set("v.body", mapBody);
                                                }
                                            );*/
                                            this.facilitySelectLocked = false;
                                                  
                                            var listTemp = [];
                                            listTemp.push('--Make a Selection--');
                                                          
                                            for(var i = 0; i < response.length; i++){
                                                if(response[i].contentCount > 0){
                                                    listTemp.push(response[i].title + ' - ' + response[i].accId);
                                                    }
                                                }
                                            this.selAccounts = listTemp;
                                            if(listTemp.length > 0){
                                                this.diasbleContentSearch = false;
                                                }
                                            else{
                                                this.diasbleContentSearch = true;
                                                }
                                            }
                                            }
                                            }
                                            catch(err){
                                                return;
                                            }
                                        }
                                        )
                                    .catch(
                                        error=>{
                                            console.log("Error in fetching Account Markers: " + error.message);
                                            }
                                        );
                                    }
                    }
            }
      
        saveRecords(){
            var proceed = true;
            this.Spinner = true;
          
            var locListCheck = this.activeAccount.Type;
            if(locListCheck.length === 0 || locListCheck === undefined || locListCheck === null || locListCheck === '--None--'){
                proceed = false;
                alert('A level of care must be provided to proceed.  If the case does not directly apply to a service, please select Not Applicable.');
                }
          
            var webAdAskCheck = this.activeCase.Website_Ad_Ask__c;
            var tvAdAskCheck = this.activeCase.TV_Ad_Ask__c;
            var onlineSearchAskCheck = this.activeCase.Online_Search_Ask__c;
            var caseSourceCheck = this.activeCase.Case_Source__c;
            var caseOriginCheck = this.activeCase.Origin;
           
            console.log('caseSourceCheck');
            if(caseSourceCheck.length === 0 || caseSourceCheck === undefined || caseSourceCheck === null || caseSourceCheck === '--None--'){
                proceed = false;
                alert('A response is required for the How did caller find Kindred? question.  Check the form entry for this item and try again.');
                }
            console.log('webAdAskCheck');
            if(webAdAskCheck.length === 0 || webAdAskCheck === undefined || webAdAskCheck === null || webAdAskCheck === '--None--'){
                proceed = false;
                alert('A response is required for the Have you seen one of our ads on a website? question.  Check the form entry for this item and try again.');
                }
            console.log('tvAdAskCheck');
            if(tvAdAskCheck.length === 0 || tvAdAskCheck === undefined || tvAdAskCheck === null || tvAdAskCheck === '--None--'){
                proceed = false;
                alert('A response is required for the Have you seen our TV advertising? question.  Check the form entry for this item and try again.');
                }
            console.log('onlineSearchAskCheck');
           if(onlineSearchAskCheck.length === 0 || onlineSearchAskCheck === undefined || onlineSearchAskCheck === null || onlineSearchAskCheck === '--None--'){
                proceed = false;
                alert('A response is required for the Have you seen us show up in an online search? question.  Check the form entry for this item and try again.');
                }
            console.log('caseOriginCheck');
            if(caseOriginCheck.length === 0 || caseOriginCheck === undefined || caseOriginCheck === null || caseOriginCheck === '--None--'){
                proceed = false;
                alert('A response is required for the Case Origin field.  Check the form entry for this item and try again.');
                }
          
            try{
                var dob = this.activePatient.Date_of_Birth__c;
                console.log('1st dob check: ' + dob);
                if(dob !== undefined){
                    var pattern =/^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})$/;
                    var pattern2 =/^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})$/;
                      if (dob == null || dob == "" || (!pattern.test(dob) && !pattern2.test(dob))) {
                        console.log('DOB: ' + dob);
                        console.log('Pattern result: ' + pattern.test(dob));
                        }
                    }
                }
            catch(errDte){
                alert("Invalid date of birth.  Check entry and retry.  Format should be in: mm/dd/yyyy");
                proceed = false;
                }
          
            var caseCurrentStatus = this.activeCase.Status;
            var editing = this.isEdit;
          
            var cType = this.activeCase.Type;
            console.log('cType: ' + cType);
                if(cType.length === 0 || cType === undefined || cType === null || cType === '--None--'){
                    proceed = false;
                    alert('Case Type must be provided.');
                    }
            if(editing === true && caseCurrentStatus !== 'Closed'){
                if(cType === 'Billing' || cType === 'Referral' || cType === 'Complaint' || cType === 'Education'){
                    proceed = false;
                    alert('The current Case Type has been retired and a new one must be chosen, please select an option that is not Billing, Referral, Complaint, or Education before proceeding.');
                    }
                }
          
            var cSType = this.activeCase.Subtype__c;
            console.log('cSType: ' + cSType);
                if(cSType.length === 0 || cSType === undefined || cSType === null || cSType === '--None--'){
                    proceed = false;
                    alert('Case Subtype must be provided.');
                    }
                if(editing === true && caseCurrentStatus !== 'Closed'){
                    if(cSType === 'Clinical' || cSType === 'Non-Clinical'){
                        proceed = false;
                        alert('The current Case Type has been retired and a new one must be chosen, please select an option that is not Clinical or Non-Clinical before proceeding.');
                        }
                    }
 
          
            var cCType = this.activeCase.Call_Type__c;
            console.log('cCType: ' + cCType);
                if(cCType.length === 0 || cCType === undefined || cCType === null || cCType === '--None--'){
                    proceed = false;
                    alert('Case Call Type must be provided.');
                    }
          
            var cLastName = this.activeContact.LastName;
            console.log('cLastName: ' + cLastName);
                if(cLastName.length === 0 || cLastName === undefined || cLastName === 'temp' || cLastName === null || cLastName === 'Last Name'){
                    proceed = false;
                    alert('Contact Last Name must be provided.');
                    }
          
            var eStatus = this.activeContact.Email_Status__c;
            var conEmail = this.activeContact.Email;
            if(eStatus === undefined){
                console.log('eStatus Required 1');
                proceed = false;
                alert("Email Status must be selected.");
                }
            else if(eStatus === '--None--' || eStatus === null || eStatus.length === 0){
                console.log('eStatus Required 2');
                proceed = false;
                alert("Email Status must be selected.");
                }
            else if(eStatus === 'Valid'){
                if(conEmail === undefined){
                    console.log('eStatus Required 3');
                    proceed = false;
                    alert("Email must be provided if status is Valid.");
                    }
                else if(conEmail.length === 0 || conEmail === null){
                    console.log('eStatus Required 4');
                    proceed = false;
                    alert("Email must be provided if status is Valid.");
                    }
                }
          
            var typeSel = this.activeCase.Subtype__c;
            console.log('Checking Patient Required: ' + typeSel);
                if(typeSel === 'Service Recommendation' || typeSel === 'Service Recommendation w/ Orders' || typeSel === 'Lead'){
                    console.log('Patient Required 1.');
                    console.log('LName.');
                    var lastName = this.activePatient.Last_Name__c;
                    console.log('Status');
                    var ptStatus = this.activePatient.Status__c;
                    console.log('StatusD');
                    var ptStatusD = this.activePatient.Status_Detail__c;
                    console.log('ptStatus: ' + ptStatus);
                    console.log('ptStatusD: ' + ptStatusD);
                    if(lastName.length === 0 || lastName === null || lastName === undefined || lastName === 'temp'){
                        proceed = false;
                        console.log('Patient LName');
                        alert('Patient Last Name must be filled in to proceed when case Subtype is Service Recommendation or Lead.  Check entries.');
                        }
                    if(ptStatus.length === 0 || ptStatus === null || ptStatus === undefined || ptStatus === '--None--'){
                        proceed = false;
                        console.log('Patient Status');        
                        alert('Patient Status must be filled in to proceed when case Subtype is Service Recommendation or Lead.  Check entries.');
                        }
                    if(ptStatusD.length === 0 || ptStatusD === null || ptStatusD === undefined || ptStatusD === '--None--'){
                        proceed = false;
                        console.log('Patient Status Detail');
                        alert('Patient Status Detail must be filled in to proceed when case Subtype is Service Recommendation or Lead.  Check entries.');
                        }
                    if(editing === true && caseCurrentStatus !== 'Closed'){
                        if(ptStatusD === 'Deceased' || ptStatusD === 'Active with Competitor' || ptStatusD === 'No Kindred Service in Area'){
                            proceed = false;
                            console.log('Patient Status Detail Alt');     
                            alert('The current Patient Status Detail has been retired, please select a new Status Detail that is not Deceased, Active with Competitor, or No Kindred Service in Area before proceeding.');
                            }
                        }
                    }
          
                console.log('Checking Payor Required: ' + typeSel);
            if(typeSel === 'Service Recommendation' || typeSel === 'Service Recommendation w/ Orders'){
                console.log('Payor Required');
                var pyName = this.activeAssessment.Payor__c;
                var pyMember = this.activeAssessment.Member_ID__c;
                var pySub = this.activeAssessment.Subscriber_Name__c;
                console.log('Payor Name: ' + pyName);
                console.log('Payor Member: ' + pyMember);
                console.log('Payor Subscriber: ' + pySub);
              
                if(pyName === undefined || pyName === '--None--' || pyName === '' || pyName === null){
                   proceed = false;
                    alert('Payor Name must be filled in to proceed when case Subtype is Service Recommendation.');
                    }
                else{
                    if(pyMember === undefined && pyName !== 'Non-funded / Uninsured'){
                        proceed = false;
                        alert('Member ID must be filled in to proceed when case Subtype is Service Recommendation unless chosen payor is Non-funded / Uninsured.');
                        }
                    else{
                        this.activeAssessment.Member_ID__c = pyMember;
                        }
                if(pySub === undefined && pyName !== 'Non-funded / Uninsured'){
                    proceed = false;
                    alert('Subscriber Name must be filled in to proceed when case Subtype is Service Recommendation unless chosen payor is Non-funded / Uninsured.');
                    }
                    }
                }
              
                var consentRequired = this.activePatient.Status__c;
                console.log('Checking Consent Required: ' + consentRequired);
                if((consentRequired === 'Lead' || consentRequired === 'Pending')){
                    console.log('Consent Required');
                    var callback = this.activePatient.Consent_for_Callback__c;
                    if(callback === undefined){
                        proceed = false;
                        alert('Consent for Callback must be selected if Patient Status is Lead or Pending.');
                        }
                    else{
                        if(callback.length === 0 || callback === null || callback === '--None--'){
                            proceed = false;
                            alert('Consent for Callback must be selected if Patient Status is Lead or Pending.');
                            }
                        }
                    }
          
            console.log('Proceed to save? ' + proceed);
            if(proceed === true){
                this.Spinner = true;
                var pt = this.activePatient.Last_Name__c;
                var assess = this.activeAssessment.Payor__c;
                //Case
                console.log('Submitting Case Set');
                if(this.isEdit === false){
                    this.activeCase.Status = 'New';
                    }
                this.activeCase.Account = this.activeAccount.Id;
                this.activeCase.Contact = this.activeContact.Id;
                var loc = this.activeCase.Type;
                if(loc !== '--None--'){  
                    this.activeCase.Level_Of_Care__c = loc;
                    this.activeContact.Level_of_Care__c = loc;
                    }
                if(assess !== null && assess !== undefined){
                    if(assess.length > 1){
                        this.activeCase.Assessment__c = this.activeAssessment.Id;
                        }
                    }
                if(pt !== null && pt !== undefined && pt !== 'temp'){
                    this.activeCase.Patient_New__c = this.activePatient.Id;
                    }
          
                //Contact
                console.log('Submitting Contact Set');
                this.activeContact.Account = this.activeAccount.Id;
          
                //Account
               console.log('Submitting Account Set');
                console.log("pt and assess: " + pt + ", " + assess);
                if(pt !== null && pt !== undefined && pt !== 'temp'){
                //Patient
                console.log('Submitting Patient Set');
                var firstName = this.activePatient.First_Name__c;
                var lastName = this.activePatient.Last_Name__c;
                if(firstName === undefined || firstName === null){
                        firstName = "";
                        this.activeAccount.Name = "The Household of " + lastName;
                        }
                    else{
                        this.activeAccount.Name = "The Household of " + firstName + ' ' + lastName;
                        }
                    }
                else{
                   var lNameC = this.activeContact.LastName;
                   var fNameC = this.activeContact.FirstName;
                   if(fNameC === undefined || fNameC === null){
                       fNameC = "";
                       this.activeAccount.Name = "The Household of " + lNameC;
                       }
                   else{
                       this.activeAccount.Name = "The Household of " + fNameC + ' ' + lNameC;
                       }
                    }
                if(assess !== null && assess !== undefined){
                    if(assess.length > 1){
                    console.log('Submitting Assessment Set');
                    this.activeAssessment.Patient__c = this.activePatient.Id;
                    }
                    }
                this.submitItemsForSave();
                }
            else{
                this.Spinner = false;
                }
            }
 
        saveClose(){
            var proceed = true;
            this.Spinner = true;
          
            var locListCheck = this.activeAccount.Type;
            if(locListCheck.length === 0 || locListCheck === undefined || locListCheck === null || locListCheck === '--None--'){
                proceed = false;
                alert('A level of care must be provided to proceed.  If the case does not directly apply to a service, please select Not Applicable.');
                }
          
            var webAdAskCheck = this.activeCase.Website_Ad_Ask__c;
            var tvAdAskCheck = this.activeCase.TV_Ad_Ask__c;
            var onlineSearchAskCheck = this.activeCase.Online_Search_Ask__c;
            var caseSourceCheck = this.activeCase.Case_Source__c;
            var caseOriginCheck = this.activeCase.Origin;
           
            console.log('caseSourceCheck');
            if(caseSourceCheck.length === 0 || caseSourceCheck === undefined || caseSourceCheck === null || caseSourceCheck === '--None--'){
                proceed = false;
                alert('A response is required for the How did caller find Kindred? question.  Check the form entry for this item and try again.');
                }
            console.log('webAdAskCheck');
            if(webAdAskCheck.length === 0 || webAdAskCheck === undefined || webAdAskCheck === null || webAdAskCheck === '--None--'){
                proceed = false;
                alert('A response is required for the Have you seen one of our ads on a website? question.  Check the form entry for this item and try again.');
                }
            console.log('tvAdAskCheck');
            if(tvAdAskCheck.length === 0 || tvAdAskCheck === undefined || tvAdAskCheck === null || tvAdAskCheck === '--None--'){
                proceed = false;
                alert('A response is required for the Have you seen our TV advertising? question.  Check the form entry for this item and try again.');
                }
            console.log('onlineSearchAskCheck');
            if(onlineSearchAskCheck.length === 0 || onlineSearchAskCheck === undefined || onlineSearchAskCheck === null || onlineSearchAskCheck === '--None--'){
                proceed = false;
                alert('A response is required for the Have you seen us show up in an online search? question.  Check the form entry for this item and try again.');
                }
            console.log('caseOriginCheck');
            if(caseOriginCheck.length === 0 || caseOriginCheck === undefined || caseOriginCheck === null || caseOriginCheck === '--None--'){
                proceed = false;
                alert('A response is required for the Case Origin field.  Check the form entry for this item and try again.');
                }
          
            try{
                var dob = this.activePatient.Date_of_Birth__c;
                console.log('1st dob check: ' + dob);
                if(dob !== undefined){
                    var pattern =/^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})$/;
                    var pattern2 =/^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})$/;
                      if (dob == null || dob == "" || (!pattern.test(dob) && !pattern2.test(dob))) {
                        console.log('DOB: ' + dob);
                        console.log('Pattern result: ' + pattern.test(dob));
                        }
                    }
                }
            catch(errDte){
                alert("Invalid date of birth.  Check entry and retry.  Format should be in: mm/dd/yyyy");
                proceed = false;
                }
          
            var caseCurrentStatus = this.activeCase.Status;
            var editing = this.isEdit;
          
            var cType = this.activeCase.Type;
            console.log('cType: ' + cType);
                if(cType.length === 0 || cType === undefined || cType === null || cType === '--None--'){
                    proceed = false;
                    alert('Case Type must be provided.');
                    }
            if(editing === true && caseCurrentStatus !== 'Closed'){
                if(cType === 'Billing' || cType === 'Referral' || cType === 'Complaint' || cType === 'Education'){
                    proceed = false;
                    alert('The current Case Type has been retired and a new one must be chosen, please select an option that is not Billing, Referral, Complaint, or Education before proceeding.');
                    }
                }
          
            var cSType = this.activeCase.Subtype__c;
            console.log('cSType: ' + cSType);
                if(cSType.length === 0 || cSType === undefined || cSType === null || cSType === '--None--'){
                    proceed = false;
                    alert('Case Subtype must be provided.');
                    }
                if(editing === true && caseCurrentStatus !== 'Closed'){
                    if(cSType === 'Clinical' || cSType === 'Non-Clinical'){
                        proceed = false;
                        alert('The current Case Type has been retired and a new one must be chosen, please select an option that is not Clinical or Non-Clinical before proceeding.');
                        }
                    }
 
           
            var cCType = this.activeCase.Call_Type__c;
            console.log('cCType: ' + cCType);
                if(cCType.length === 0 || cCType === undefined || cCType === null || cCType === '--None--'){
                    proceed = false;
                    alert('Case Call Type must be provided.');
                    }
          
            var cLastName = this.activeContact.LastName;
            console.log('cLastName: ' + cLastName);
                if(cLastName.length === 0 || cLastName === undefined || cLastName === 'temp' || cLastName === null || cLastName === 'Last Name'){
                    proceed = false;
                    alert('Contact Last Name must be provided.');
                    }
          
            var eStatus = this.activeContact.Email_Status__c;
            var conEmail = this.activeContact.Email;
            if(eStatus === undefined){
                console.log('eStatus Required 1');
                proceed = false;
                alert("Email Status must be selected.");
                }
            else if(eStatus === '--None--' || eStatus === null || eStatus.length === 0){
                console.log('eStatus Required 2');
                proceed = false;
                alert("Email Status must be selected.");
                }
            else if(eStatus === 'Valid'){
                if(conEmail === undefined){
                    console.log('eStatus Required 3');
                    proceed = false;
                    alert("Email must be provided if status is Valid.");
                    }
                else if(conEmail.length === 0 || conEmail === null){
                    console.log('eStatus Required 4');
                    proceed = false;
                    alert("Email must be provided if status is Valid.");
                    }
                }
          
            var typeSel = this.activeCase.Subtype__c;
            console.log('Checking Patient Required: ' + typeSel);
                if(typeSel === 'Service Recommendation' || typeSel === 'Service Recommendation w/ Orders' || typeSel === 'Lead'){
                    console.log('Patient Required 1.');
                    console.log('LName.');
                    var lastName = this.activePatient.Last_Name__c;
                    console.log('Status');
                    var ptStatus = this.activePatient.Status__c;
                    console.log('StatusD');
                    var ptStatusD = this.activePatient.Status_Detail__c;
                    console.log('ptStatus: ' + ptStatus);
                    console.log('ptStatusD: ' + ptStatusD);
                    if(lastName.length === 0 || lastName === null || lastName === undefined || lastName === 'temp'){
                        proceed = false;
                        console.log('Patient LName');
                        alert('Patient Last Name must be filled in to proceed when case Subtype is Service Recommendation or Lead.  Check entries.');
                        }
                    if(ptStatus.length === 0 || ptStatus === null || ptStatus === undefined || ptStatus === '--None--'){
                        proceed = false;
                        console.log('Patient Status');        
                        alert('Patient Status must be filled in to proceed when case Subtype is Service Recommendation or Lead.  Check entries.');
                        }
                    if(ptStatusD.length === 0 || ptStatusD === null || ptStatusD === undefined || ptStatusD === '--None--'){
                        proceed = false;
                        console.log('Patient Status Detail');
                        alert('Patient Status Detail must be filled in to proceed when case Subtype is Service Recommendation or Lead.  Check entries.');
                        }
                    if(editing === true && caseCurrentStatus !== 'Closed'){
                        if(ptStatusD === 'Deceased' || ptStatusD === 'Active with Competitor' || ptStatusD === 'No Kindred Service in Area'){
                            proceed = false;
                            console.log('Patient Status Detail Alt');     
                            alert('The current Patient Status Detail has been retired, please select a new Status Detail that is not Deceased, Active with Competitor, or No Kindred Service in Area before proceeding.');
                            }
                        }
                    }
          
                console.log('Checking Payor Required: ' + typeSel);
            if(typeSel === 'Service Recommendation' || typeSel === 'Service Recommendation w/ Orders'){
                console.log('Payor Required');
                var pyName = this.activeAssessment.Payor__c;
                var pyMember = this.activeAssessment.Member_ID__c;
                var pySub = this.activeAssessment.Subscriber_Name__c;
                console.log('Payor Name: ' + pyName);
                console.log('Payor Member: ' + pyMember);
                console.log('Payor Subscriber: ' + pySub);
              
                if(pyName === undefined || pyName === '--None--' || pyName === '' || pyName === null){
                    proceed = false;
                    alert('Payor Name must be filled in to proceed when case Subtype is Service Recommendation.');
                    }
                else{
                    if(pyMember === undefined && pyName !== 'Non-funded / Uninsured'){
                        proceed = false;
                        alert('Member ID must be filled in to proceed when case Subtype is Service Recommendation unless chosen payor is Non-funded / Uninsured.');
                        }
                    else{
                        this.activeAssessment.Member_ID__c = pyMember;
                        }
                if(pySub === undefined && pyName !== 'Non-funded / Uninsured'){
                    proceed = false;
                    alert('Subscriber Name must be filled in to proceed when case Subtype is Service Recommendation unless chosen payor is Non-funded / Uninsured.');
                    }
                    }
                }
              
                var consentRequired = this.activePatient.Status__c;
                console.log('Checking Consent Required: ' + consentRequired);
                if((consentRequired === 'Lead' || consentRequired === 'Pending')){
                    console.log('Consent Required');
                    var callback = this.activePatient.Consent_for_Callback__c;
                    if(callback === undefined){
                        proceed = false;
                        alert('Consent for Callback must be selected if Patient Status is Lead or Pending.');
                        }
                    else{
                        if(callback.length === 0 || callback === null || callback === '--None--'){
                            proceed = false;
                            alert('Consent for Callback must be selected if Patient Status is Lead or Pending.');
                            }
                        }
                    }
          
            console.log('Proceed to save? ' + proceed);
            if(proceed === true){
                this.Spinner = true;
                var pt = this.activePatient.Last_Name__c;
                var assess = this.activeAssessment.Payor__c;
                //Case
                console.log('Submitting Case Set');
                this.activeCase.Status = 'Closed';
                this.activeCase.Account = this.activeAccount.Id;
                this.activeCase.Contact = this.activeContact.Id;
                var loc = this.activeCase.Type;
                if(loc !== '--None--'){  
                    this.activeCase.Level_Of_Care__c = loc;
                    this.activeContact.Level_of_Care__c = loc;
                    }
                if(assess !== null && assess !== undefined){
                    if(assess.length > 1){
                        this.activeCase.Assessment__c = this.activeAssessment.Id;
                        }
                    }
                if(pt !== null && pt !== undefined && pt !== 'temp'){
                    this.activeCase.Patient_New__c = this.activePatient.Id;
                    }
          
                //Contact
                console.log('Submitting Contact Set');
                this.activeContact.Account = this.activeAccount.Id;
          
                //Account
                console.log('Submitting Account Set');
                console.log("pt and assess: " + pt + ", " + assess);
                if(pt !== null && pt !== undefined && pt !== 'temp'){
                //Patient
                console.log('Submitting Patient Set');
                var firstName = this.activePatient.First_Name__c;
                var lastName = this.activePatient.Last_Name__c;
                if(firstName === undefined || firstName === null){
                        firstName = "";
                        this.activeAccount.Name = "The Household of " + lastName;
                        }
                    else{
                        this.activeAccount.Name = "The Household of " + firstName + ' ' + lastName;
                        }
                    }
                else{
                   var lNameC = this.activeContact.LastName;
                   var fNameC = this.activeContact.FirstName;
                   if(fNameC === undefined || fNameC === null){
                       fNameC = "";
                       this.activeAccount.Name = "The Household of " + lNameC;
                       }
                   else{
                       this.activeAccount.Name = "The Household of " + fNameC + ' ' + lNameC;
                       }
                    }
                if(assess !== null && assess !== undefined){
                    if(assess.length > 1){
                    console.log('Submitting Assessment Set');
                    this.activeAssessment.Patient__c = this.activePatient.Id;
                    }
                    }
                this.submitItemsForSave();
                }
            else{
                this.Spinner = false;
                }
            }

        cancelCase(){
            this.Spinner = true;
            var caseType = this.activeCase.RecordTypeId;
            console.log("case recordType: " + caseType);
            if(caseType === '012c0000000253IAAQ' || caseType === '012c0000000253I' || caseType === '0121B000001RZAJQA4' || caseType === '0121B000001RZAJ'){
                this.cancelTheCase();
                }
            else{
                this.cancelAndReturn();
                }
            this.Spinner = false;
            }
      
        getContent(){
            this.showModalSearch = true;
            helper.getSelectedContent(component);
            }
      
        filterArticles(){
            var arType = event.target.name;
            var art = this.template.querySelectorAll(".art");
            
            if(arType === 'Kindred'){
                art.forEach(function(element){
                    if(element.name === 'allKnowledgeBase'){
                        element.checked = false;
                        }
                    else if(element.name === 'gentivaKnowledgeBase'){
                        element.checked = false;
                        }
                    }, this);
                }
            else if(arType === 'Gentiva'){
                art.forEach(function(element){
                    if(element.name === 'allKnowledgeBase'){
                        element.checked = false;
                        }
                    else if(element.name === 'kindredKnowledgeBase'){
                        element.checked = false;
                        }
                    }, this);
                }
            else if(arType === 'All'){
                art.forEach(function(element){
                    if(element.name === 'gentivaKnowledgeBase'){
                        element.checked = false;
                        }
                    else if(element.name === 'kindredKnowledgeBase'){
                        element.checked = false;
                        }
                    }, this);
                }
            console.log('Radio Value: ' + arType);
            this.articleTypeFilter = arType;
            this.findArticles();
            }
      
        searchArticles(){
            this.findArticles();
            }
      
        handleUploadFinished(){
            var uploadedFiles = event.getParam("files");
            this.showAttachList();
            alert("Files uploaded");
            }
       
        openKnowledge(){
            this.openArticleItem();
            }
      
        openLibrary(){
            this.openLibraryItem();
            }

        getSelectedContent(){
                this.fileList = null;
                console.log('Populate Account Content');
                console.log('contentAccount2: ' + this.inputSelectAccount);
                retreiveFacilityContent({
                    "selectedAccount" : this.inputSelectAccount
                    })
                    .then(result=>{
                        var repList = result;
                        this.fileList = repList;
                        this.showContentModal = true;
                        }
                    )
                    .catch(
                        error=>{
                            console.log("Error in fetching Account Content: " + error.message);
                            }
                        );
                }
          
            cancelTheCase(){
                this.Spinner = true;
                console.log('Cancel Case');
                processCancelCase(
                    {
                    "activeCase" : this.activeCase,
                    "activeContact" : this.activeContact,
                    "activeAccount" : this.activeAccount,
                    "activePatient" : this.activePatient,
                    "activeAssessment" : this.activeAssessment,
                    }
                    )
                    .then(
                        result=>{
                            var repList = result;
                            if(repList === 'Success'){
                                window.location.href =  '/lightning/o/Case/list?filterName=Recent&0.source=alohaHeader';
                                }
                            else{
                                alert("There was an issue in the process.  Please let the administrator know: " + repList);
                                }
                            }
                        )
                    .catch(
                        error=>{
                            console.log("Error in Cancelling Case: " + error);
                            this.Spinner = false;
                            }
                        );
                }
          
            cancelAndReturn(){
                this.Spinner = true;
                console.log('Cancel Case');
                cancelReturn().then(
                    result=>{
                        var repList = result;
                        if(repList === 'Success'){      
                            this.Spinner = false;
                            var recId = this.activeCase.Id;
                            window.location.href =  '/'+ recId ;
                            }
                        }
                    )
                .catch(error=>{
                    console.log("Error in Cancelling items.");
                    this.Spinner = false;
                    }
                    );
                }
          
            submitItemsForSave(){
                this.Spinner = true;
                var action = component.get("c.processSaveItems");
                processSaveItems({
                    "activeCase" : this.activeCase,
                    "activeContact" : this.activeContact,
                    "activeAccount" : this.activeAccount,
                    "activePatient" : this.activePatient,
                    "activeAssessment" : this.activeAssessment,
                    })
                .then(
                    result=>{
                        var repList = result;
                        var recordId = this.activeCase.Id;
                        this.Spinner = false;
                        window.location.href =  '/'+ recordId ;
                        }
                    )
                .catch(
                    error=>{
                        this.Spinner = false;
                        alert("Save error, check entry fields and try again: " + error);
                        }
                    );
                }
           
            findArticles(){
                this.articleList = null;
                console.log('Finding Articles');
                filterKnowledgeArticles({
                    "articleSearchString" : this.articleSearchString,
                    "articleTypeFilter" : this.articleTypeFilter
                    })
                    .then(
                        result=>{
                            this.articleList = result;
                        }
                    )
                    .catch(
                        error=>{
                            alert("Article List retireval error: " + error);
                        }
                    );
                }
          
            showAttachList(){
                this.attachmentItems = null;
                console.log("Finding Attachments");
                getAttachments({"parentId" : this.activeCase.Id}).then(
                    result=>{
                        this.attachmentItems = result;
                    }
                    )
                .catch(
                    error=>{
                        alert("Attachment List retireval error: " + error);
                    }
                );
                }
          
            openArticleItem(){
                console.log('Starting Navigation');
                    var id = event.target.title;
                    var pageReference = {
                                type: 'standard__recordPage',
                                    attributes: {
                                                actionName: 'view',
                                                objectApiName: 'Contact_Center_kav',
                                                recordId : id
                                                },
                                    };
                }
          
            openLibraryItem(){
                console.log('Starting Navigation');
                    var id = event.target.title;
                    var pageReference = {
                                type: 'standard__recordPage',
                                    attributes: {
                                                actionName: 'view',
                                                objectApiName: 'Contact_Center_kav',
                                                recordId : id
                                                },
                                    };
                }
          
            checkServerItems(){
                var accPatient = this.activePatient.Id;
                var accAssessment = this.activeAssessment.Id;
                if(accPatient === undefined){
                    this.getNewPatient();
                    }
                if(accAssessment === undefined){
                    this.getNewAssessment();
                    }
                }
               
}
