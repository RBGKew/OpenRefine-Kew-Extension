/*

Copyright 2010, Google Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

 * Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above
copyright notice, this list of conditions and the following disclaimer
in the documentation and/or other materials provided with the
distribution.
 * Neither the name of Google Inc. nor the names of its
contributors may be used to endorse or promote products derived from
this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,           
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY           
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

 */

var KewExtendDataManager = {
		customServices : [],     // services registered by core and extensions
		standardServices : [],   // services registered by user
		_urlMap : {}
};

KewExtendDataManager._rebuildMap = function() {
	var map = {};
	$.each(KewExtendDataManager.getAllServices(), function(i, service) {
		if ("url" in service) {
			map[service.url] = service;
		}
	});
	KewExtendDataManager._urlMap = map;
};

KewExtendDataManager.getServiceFromUrl = function(url) {
	return KewExtendDataManager._urlMap[url];
};

KewExtendDataManager.getAllServices = function() {
	return KewExtendDataManager.customServices.concat(KewExtendDataManager.standardServices);
};

KewExtendDataManager.registerService = function(service) {
	KewExtendDataManager.customServices.push(service);
	KewExtendDataManager._rebuildMap();

	return KewExtendDataManager.customServices.length - 1;
};

KewExtendDataManager.registerStandardService = function(url, name, f) {
	//var dismissBusy = DialogSystem.showBusy($.i18n._('core-recon')["contact-service"]+"...");

	var data = {};

	//$.ajax(
	//		url,
	//		{ "dataType" : "jsonp",
	//			"timeout":10000
	//		}
	//)
	//.success(function(data, textStatus, jqXHR) {
		data.url = url;
		data.name = name ? name : url;
		data.ui = { "handler" : "X-Unused" };

		index = KewExtendDataManager.customServices.length + KewExtendDataManager.standardServices.length;

		KewExtendDataManager.standardServices.push(data);
		KewExtendDataManager._rebuildMap();

		KewExtendDataManager.save();

		//dismissBusy();

		if (f) {
			f(index);
		}
	//})
	//.error(function(jqXHR, textStatus, errorThrown) {
	//	dismissBusy(); 
	//	alert($.i18n._('core-recon')["error-contact"]+': ' + textStatus + ' : ' + errorThrown + ' - ' + url);
	//});
};

KewExtendDataManager.unregisterService = function(service, f) {
	for (var i = 0; i < KewExtendDataManager.customServices.length; i++) {
		if (KewExtendDataManager.customServices[i] === service) {
			KewExtendDataManager.customServices.splice(i, 1);
			break;
		}
	}
	for (var i = 0; i < KewExtendDataManager.standardServices.length; i++) {
		if (KewExtendDataManager.standardServices[i] === service) {
			KewExtendDataManager.standardServices.splice(i, 1);
			break;
		}
	}
	KewExtendDataManager._rebuildMap();
	KewExtendDataManager.save(f);
};

KewExtendDataManager.save = function(f) {
	$.ajax({
		async: false,
		type: "POST",
		url: "command/core/set-preference?" + $.param({
			name: "kew.mqlServices"
		}),
		data: { "value" : JSON.stringify(KewExtendDataManager.standardServices) },
		success: function(data) {
			if (f) { f(); }
		},
		dataType: "json"
	});
};

(function() {
	$.ajax({
		async: false,
		url: "command/core/get-preference?" + $.param({
			name: "kew.mqlServices"
		}),
		success: function(data) {
			if (data.value && data.value != "null") {
				KewExtendDataManager.standardServices = JSON.parse(data.value);
				KewExtendDataManager._rebuildMap();
			}
			else {
				KewExtendDataManager.registerStandardService("http://www.theplantlist.org/tpl1.1/mql", "The Plant List");
				//KewExtendDataManager.registerStandardService("http://10.128.129.91:8082/mql", "IPNI (A9481)");
			}
		},
		dataType: "json"
	});
})();
