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

/**
 * This is a modified version of the original java class FreebaseDataExtensionJob.
 * @author Eliza Chan
 *
 */
package org.kew.openrefine.util;

import java.io.DataOutputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.net.URL;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.google.refine.freebase.util.FreebaseDataExtensionJob;
import com.google.refine.model.ReconCandidate;
import com.google.refine.util.ParsingUtilities;

public class KewDataExtensionJob extends FreebaseDataExtensionJob {
    
    private static String kewMqlUrl;

    public KewDataExtensionJob(JSONObject obj) throws JSONException {
        super(obj);
    }

    @Override
    public Map<String, FreebaseDataExtensionJob.DataExtension> extend(
            Set<String> ids,
            Map<String, ReconCandidate> reconCandidateMap
        ) throws Exception {
            StringWriter writer = new StringWriter();
            formulateQuery(ids, extension, writer);
            String query = writer.toString();
            
            String result = doMqlRead(query);
            
            JSONObject o = ParsingUtilities.evaluateJsonStringToObject(result);
            Map<String, FreebaseDataExtensionJob.DataExtension> map = new HashMap<String, FreebaseDataExtensionJob.DataExtension>();
            if (o.has("result")) {
                JSONArray a = o.getJSONArray("result");
                int l = a.length();

                for (int i = 0; i < l; i++) {
                    JSONObject o2 = a.getJSONObject(i);
                    String id = o2.getString("id");
                    FreebaseDataExtensionJob.DataExtension ext = collectResult(o2, reconCandidateMap);

                    if (ext != null) {
                        map.put(id, ext);
                    }
                }
            }

            return map;
        } 

    static protected String doMqlRead(String query) throws IOException {
        // Kew-MQL-specific
        if (kewMqlUrl == null) {
            throw new IOException("No Kew MQL URL defined");
        }
        
        URL url = new URL(kewMqlUrl + "/read");

        System.out.println("Kew MQL url: " + url.getPath());
        System.out.println("Kew MQL query: " + query);

        URLConnection connection = url.openConnection();
        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        connection.setConnectTimeout(5000);
        connection.setDoOutput(true);
        
        DataOutputStream dos = new DataOutputStream(connection.getOutputStream());
        try {
            String body = "extended=1&query=" + ParsingUtilities.encode(query);
            
            dos.writeBytes(body);
        } finally {
            dos.flush();
            dos.close();
        }
        
        connection.connect();
        
        String s = ParsingUtilities.inputStreamToString(connection.getInputStream());
        connection.getInputStream().close();
        return s;
    }

    public void setKewMqlUrl(String kewMqlUrl) {
        KewDataExtensionJob.kewMqlUrl = kewMqlUrl;
    }
}
