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

function init() {

	// Operations
	var OR = Packages.com.google.refine.operations.OperationRegistry;
	OR.registerOperation(module, "extend-data", Packages.org.kew.openrefine.operations.KewExtendDataOperation);

	// Commands
	var RS = Packages.com.google.refine.RefineServlet;
	RS.registerCommand(module, "extend-data", new Packages.org.kew.openrefine.commands.KewExtendDataCommand());
	RS.registerCommand(module, "preview-extend-data", new Packages.org.kew.openrefine.commands.KewPreviewExtendDataCommand());

	// Client-side Resources
	var ClientSideResourceManager = Packages.com.google.refine.ClientSideResourceManager;

	// Script files to inject into /project page
	ClientSideResourceManager.addPaths(
			"project/scripts",
			module,
			[
			 "scripts/extension.js",
			 "scripts/dialogs/extend-data-manager.js",
			 "scripts/dialogs/extend-data-preview-dialog.js",
			 ]
	);

	// Style files to inject into /project page
	ClientSideResourceManager.addPaths(
			"project/styles",
			module,
			[]
	);
}
