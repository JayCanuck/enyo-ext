package ca.canuckcoding.enyo;

import java.applet.Applet;
import netscape.javascript.JSObject;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import org.json.JSONException;
import org.json.JSONObject;

public class EnyoApplet extends Applet {
	private static final long serialVersionUID = 1L;
	private String callback = null;
	
	public void enyoAppletInit(String callbackName) {
		callback = callbackName;
	}
	
	public void enyoAppletCall(String payload) {
		try {
			JSONObject json = new JSONObject(payload);
			String methodName = json.getString("method");
			JSONObject params = json.getJSONObject("params");
			try {
				Method method = this.getClass().getMethod(methodName, JSONObject.class);
				try {
					method.invoke(this, params);
				} catch (IllegalArgumentException e) {
				} catch (IllegalAccessException e) {
				} catch (InvocationTargetException e) {
				}
			} catch (SecurityException e) {
				e.printStackTrace();
			} catch (NoSuchMethodException e) {
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
	
	public void sendToEnyo(JSONObject data) {
		String returnData = "{}";
		if(data!=null && callback!=null) {
			returnData = data.toString();
			JSObject jso = JSObject.getWindow(this);
			jso.call(callback, new String[]{returnData});
		}
	}
}
