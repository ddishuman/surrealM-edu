exports.install = function (Vue) {
    Vue.prototype.GetRedirectUri = function () {
        //let Uri = "http://127.0.0.1:51772/";
        //let Uri = "http://192.168.1.98:8887/SURREALM/OpenIDRes";
        //let Uri = "http://3.112.174.149:8888/SURREALM/OpenIDRes";
        let Uri = "https://surrealm.hlc.edu.tw/SURREALM/OpenIDRes";
        
        return Uri;
    }

    Vue.prototype.ConsoleLog = function (msg) {
        let debug = true;
        if (debug) {
            console.log(msg);
        }
    };

    Vue.prototype.AppShow = function (appName) {
        let lectureList = JSON.parse(localStorage.getItem("lectureList"));
        let indexOf = lectureList.findIndex((obj) => obj.Lecture == appName);

        if (indexOf >= 0) {
            let now = Date.now();
            let ExpireTime = Date.parse(lectureList[indexOf].ExpireTime);
            if (now >= ExpireTime) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    };

    Vue.prototype.GetParameterByName = function (name, url) {
        if (!url) url = window.location.href;
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };

    Vue.prototype.ChkLoginData = function (account, password) {
        let errCode = 0;
        if (account == "") {
            errCode = 1001;
        } else if (password == "") {
            errCode = 1002;
        }
        return errCode;
    };

    Vue.prototype.ExportExcel = function (tableID) {
        let tab_text = '<head><meta charset="UTF-8" /></head><table border="2px"><tr>';
        let j = 0;
        let tab = document.getElementById(tableID); // id of table
        let sa;

        for (j = 0; j < tab.rows.length; j++) {
            tab_text = tab_text + tab.rows[j].innerHTML + '</tr>';
            //tab_text=tab_text+"</tr>";
        }

        tab_text = tab_text + '</table>';
        tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, ''); //remove if u want links in your table
        tab_text = tab_text.replace(/<img[^>]*>/gi, ''); // remove if u want images in your table
        tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ''); // reomves input params

        //var ua = window.navigator.userAgent;
        //var msie = ua.indexOf('MSIE ');

        // if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        //   // If Internet Explorer
        //   txtArea1.document.open('txt/html', 'replace');
        //   txtArea1.document.write(tab_text);
        //   txtArea1.document.close();
        //   txtArea1.focus();
        //   sa = txtArea1.document.execCommand('SaveAs', true, 'Say Thanks to Sumit.xls');
        // } //other browser not tested on IE 11
        // else {
        //   sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
        // }
        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
        return sa;
    };

    Vue.prototype.SecondToTime = function (oriSecond) {
        let hours = parseInt(oriSecond / 3600) + '';
        let minutes = parseInt((oriSecond % 3600) / 60) + '';
        let seconds = (oriSecond % 60) + '';
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    };

    Vue.prototype.TestEmail = function (email) {
        var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    };

    Vue.prototype.TestPassword = function (password) {
        var regex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{6,12}$/;
        return regex.test(password);
    };

    Vue.prototype.GetRoomType = function () {
        let data = [
            { Text: '請選擇', Type: '', Value: 0 },
            { Text: '一般教室', Type: '100', Value: 30 },
            { Text: '專科教室－透視人體', Type: '1001', Value: 30 },
            { Text: '專科教室－認識台灣趣', Type: '1002', Value: 30 },
            { Text: '專科教室－教具酷', Type: '200', Value: 30 },
        ];
        return data;
    }

    Vue.prototype.DeepCopy = function (Array) {
        return JSON.parse(JSON.stringify(Array));
    };

};
