import axios from 'axios'
import Vue from 'vue'

// const apiServer = "http://192.168.1.174:5600/";
// const webServer = "http://localhost:8080/";

// const apiServer = "http://192.168.1.98:5600/";
// const webServer = "http://192.168.1.98:8887/";

const apiServer = "https://surrealmedudemoapi.surreal.com.tw/";
const webServer = "https://surrealmedudemo.surreal.com.tw/";

// const apiServer = "https://surrealmeduapi.surreal.com.tw/";
// const webServer = "https://surrealmedu.surreal.com.tw/";


let loginRequest = axios.create({
    baseURL: apiServer,
})
let modelRequest = axios.create({
    baseURL: apiServer + "m/",
})

modelRequest.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});

modelRequest.interceptors.response.use((response) => {
    return response;
}, (error) => {
    errorHandle(error.response.status, error);
    return Promise.reject(error);
});

const errorHandle = (status, msg) => {
    console.log("status =" + status + " , msg = " + msg);
    let currentUrl;
    let currentPage;
    let type;
    switch (status) {
        case 401:
            currentUrl = window.location.href;
            console.log("currentUrl =" + currentUrl);
            currentPage = currentUrl.split(webServer)[1];
            console.log("currentPage =" + currentPage);
            if (currentUrl.toLowerCase().includes("surrealm")) {
                if (currentUrl.toLowerCase().includes("superadmin")) {
                    type = "surrealmSuperAdmin";
                } else if (currentUrl.toLowerCase().includes("admin")) {
                    type = "surrealmAdmin";
                } else {
                    type = "surrealm";
                }
            } else {
                type = "";
            }
            location.replace("/TokenFailure?Page=" + currentPage + "&Type=" + type);
            break;
        default:
            break;
    }
};

export const apiTeacherGetRecord = apiServer + "examrecord/";

export const apiStudentGetRecord = apiServer + "studentexamrecord/";

export const apiUserLogin = data => loginRequest.post('/login', data)

export const apiUserLogout = data => loginRequest.post('/logout', data)

export const apiOpenIDLogin = data => loginRequest.post('/openidlogin', data)

export const apiResetPW = (account, data) => loginRequest.patch('/resetpw/' + account, data)

export const apiActivate = data => loginRequest.post('/activate', data)

export const apiForgetPW = account => loginRequest.get('/forgetpw/' + account)

export const apiMaintainMsg = () => loginRequest.get('/maintain')

export const apicheckEmail = data => loginRequest.post('/checkemail', data)

export const apiUpdateAccountInfo = (data) => modelRequest.patch('/accountinfo', data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiChangePW = (data) => modelRequest.patch('/changepw', data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiAddTag = (data) => modelRequest.post('/tag', data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiGetTag = () => modelRequest.get('/tag', {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiUpdateTag = (serial, data) => modelRequest.patch('tag/' + serial, data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiDelTag = (serial) => modelRequest.delete('/tag/' + serial, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiAddLink = (data) => modelRequest.post('/link', data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiGetLink = () => modelRequest.get('/link', {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiDelLink = (serial) => modelRequest.delete('/link/' + serial, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiAddContact = (data) => modelRequest.post('/contact', data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiImportContact = (serial, data) => modelRequest.post('/batchregister/' + serial, data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiUpdateContact = (serial, data) => modelRequest.patch('/contact/' + serial, data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiDelContact = (data) => modelRequest.patch('/delcontact', data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiGetStudentByTag = (serial) => modelRequest.get('/studenttag/' + serial, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiAddLecture = (data) => modelRequest.post('/lecture', data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiUpdateLecture = (data) => modelRequest.patch('/lecture', data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiGetLecture = () => modelRequest.get('/lecturelist', {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiGetLectureStudent = () => modelRequest.get('/studentlecturelist', {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiDelLecture = (serial) => modelRequest.delete('/lecture/' + serial, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiGetStudentDetailByTag = (serial) => modelRequest.get('/studentdetail/' + serial, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiGetTagByStudent = (serials) => modelRequest.get('/tagbystudent/' + serials, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiAddStudentTag = (serial, data) => modelRequest.patch('/addstudenttag/' + serial, data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiDelStudentTag = (serial, data) => modelRequest.patch('/delstudenttag/' + serial, data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiGetFinishLecture = (params) => modelRequest.get('/finishedrecordlist', {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
    params: params
})

export const apiGetFinishLectureDetail = (serial) => modelRequest.get('/finishedrecord/' + serial, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiGetFinishLectureStudent = (params) => modelRequest.get('/studentfinishedrecordlist', {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
    params: params
})

export const apiGetFinishLectureDetailStudent = (serial) => modelRequest.get('/studentfinishedrecord/' + serial, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiGetPost = (type) => modelRequest.get('/annocementlist/' + type, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiGetPostStudent = (type) => modelRequest.get('/studentannocementlist/' + type, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiUpdatePostRead = (postSerial, data) => modelRequest.post('/annocementread/' + postSerial, data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiAddPost = (serial, data) => modelRequest.post('/annocement/' + serial, data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiCopyLecture = (serial, data) => modelRequest.post('/copylecture/' + serial, data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiGetLectureBySerial = (serial) => modelRequest.get('/lecture/' + serial, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiGetModelsByType = (lectureType) => modelRequest.get('/lecturemodel/' + lectureType, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiInsertExam = (serial, data) => modelRequest.post('/exam/' + serial, data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiGetExam = (serial) => modelRequest.get('/exam/' + serial, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiGetTeachingCool = () => modelRequest.get('/teachingcool', {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiGetLectureType = () => modelRequest.get('/lecturetype', {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiGetAllLectureType = () => modelRequest.get('/alllecturetype', {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiGetHelmetFileUrl = (helmet) => modelRequest.get('/apkinfo/' + helmet, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiGetLastApkInfo = () => modelRequest.get('/lastapkinfo', {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})

export const apiGeMaxUsingNo = (date, starttime, endtime, serial) => modelRequest.get('/checklecture/' + date + "/" + starttime + "/" + endtime + "/" + serial, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('Token'))
    },
})



/************ Admin ************/

export const apiUpdateAdminAccount = (data) => loginRequest.patch('/adminaccount', data)

export const apiAdminLogin = data => loginRequest.post('/adminlogin', data)

export const apiAdminForgetPW = (account) => loginRequest.get('/forgetadminpw/' + account)

export const apiAdminResetPW = (data, account) => loginRequest.patch('/resetadminpw/' + account, data)

export const apiGetAdminInfo = () => modelRequest.get('/admininfo', {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('AdminToken'))
    },
})

export const apiUpdateAdminInfo = (data) => modelRequest.patch('/adminaccount', data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('AdminToken'))
    },
})

export const apiGetAdminAccount = (type) => modelRequest.get('/adminaccount/' + type, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('AdminToken'))
    },
})

export const apiAddAccount = (data) => modelRequest.post('/account', data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('AdminToken'))
    },
})

export const apiDelAccount = (serial) => modelRequest.delete('/account/' + serial, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('AdminToken'))
    },
})

export const apiImportAccount = (role, data) => modelRequest.post('/batchaccount/' + role, data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('AdminToken'))
    },
})

export const apiGetResetPwEmail = () => modelRequest.get('/resetadminpw', {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('AdminToken'))
    },
})

export const apiUpdateAccountName = (data) => modelRequest.patch('/accountname', data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('AdminToken'))
    },
})



/************ SuperAdmin ************/

export const apiSuperAdminLogin = data => loginRequest.post('/superadminlogin', data)

export const apiGetAdminList = () => modelRequest.get('/adminlist', {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('SuperAdminToken'))
    },
})

export const apiGetAdmindetail = (serial) => modelRequest.get('/admindetail/' + serial, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('SuperAdminToken'))
    },
})

export const apiGetAdminAccountdetail = (serial, role) => modelRequest.get('/adminaccountdetail/' + serial + "/" + role, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('SuperAdminToken'))
    },
})

export const apiGetSPAdminLectureType = () => modelRequest.get('/alllecturetype', {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('SuperAdminToken'))
    },
})

export const apiGetSPAdminLectureAuth = () => modelRequest.get('/lectureauth', {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('SuperAdminToken'))
    },
})

export const apiPostAdminAccount = (data) => modelRequest.post('/adminaccount', data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('SuperAdminToken'))
    },
})

export const apiPatchAdminDetail = (data) => modelRequest.patch('/admindetail', data, {
    headers: {
        accessToken: Vue.prototype.TokenDecode(localStorage.getItem('SuperAdminToken'))
    },
})



