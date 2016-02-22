
package at.modalog.cordova.plugin.cache;
import java.io.File;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import android.content.Context;
import org.json.JSONArray;
import org.json.JSONException;

import android.annotation.TargetApi;
import android.app.Activity;
import android.util.Log;

@TargetApi(19)
public class Cache extends CordovaPlugin
{
	private static final String LOG_TAG = "Cache";
	private CallbackContext callbackContext;
	private Context appContext;
	/**
	 * Constructor.
	 */
	public Cache() {
		
	}

    @Override
    public boolean execute (String action, JSONArray args, CallbackContext callbackContext) throws JSONException{
		/*try
		{
		*/
			appContext = this.cordova.getActivity().getApplicationContext(); 
			if( action.equals("clear") ){
				Log.v(LOG_TAG,"Cordova Android Cache.clear() called.");
		        this.callbackContext = callbackContext;
				
				final Cache self = this;
		        cordova.getActivity().runOnUiThread( new Runnable() {
		            public void run(){
						try{
							// clear the cache
							self.webView.clearCache(true);
							//forcibly clear any fuddu cache left behind
							deleteCache(appContext);

							// send success result to cordova
							PluginResult result = new PluginResult(PluginResult.Status.OK);
							result.setKeepCallback(false); 
							self.callbackContext.sendPluginResult(result);
						}
						catch( Exception e ){
							String msg = "Error while clearing webview cache.";
							Log.e(LOG_TAG, msg );
							
							// return error answer to cordova
							PluginResult result = new PluginResult(PluginResult.Status.ERROR, msg);
							result.setKeepCallback(false); 
							self.callbackContext.sendPluginResult(result);
						}
		            }
		        });
				return true;
			}
			return false;
			/*
		}
		catch (JSONException e)
		{
			// TODO: signal JSON problem to JS
			//callbackContext.error("Problem with JSON");
			return false;
		}
		*/
    }

    private static void deleteCache(Context context) {
	    try {
	        File dir = context.getCacheDir();
	        if (dir != null && dir.isDirectory()) {
	            deleteDir(dir);
	        }
	    } catch (Exception e) {
	    	Log.v(LOG_TAG,"There was an error deleting the cache" + e.getMessage());
	    }
	}

	private static boolean deleteDir(File dir) {
	    if (dir != null && dir.isDirectory()) {
	        String[] children = dir.list();
	        for (int i = 0; i < children.length; i++) {
	            boolean success = deleteDir(new File(dir, children[i]));
	            if (!success) {
	                return false;
	            }
	        }
	    }
	    return dir.delete();
	}
}