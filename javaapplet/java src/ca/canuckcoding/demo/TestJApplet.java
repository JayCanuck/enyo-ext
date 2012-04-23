package ca.canuckcoding.demo;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import ca.canuckcoding.enyo.EnyoJApplet;
import javax.swing.JButton;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import org.json.JSONException;
import org.json.JSONObject;

	
public class TestJApplet extends EnyoJApplet {
	private static final long serialVersionUID = 1L;
	private JButton btn;
	private JScrollPane scroll;
	private JTextArea txt;
	
	public void init() {
		btn = new JButton("Send Data");
		scroll = new JScrollPane();
		txt = new JTextArea();
		txt.setText("Text here will be sent to Enyo as an onDataReceived event.");
		txt.setWrapStyleWord(true);
	    getContentPane().setLayout(new BorderLayout());
	    scroll.getViewport().setView(txt);
	    scroll.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_AS_NEEDED);
	    scroll.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED);
	    getContentPane().add(scroll, "Center");
	    getContentPane().add(btn, "South");
	    getContentPane().setBackground(Color.darkGray);

	    this.btn.addActionListener(new ActionListener() {
	    	public void actionPerformed(ActionEvent ae) {
	    		JSONObject result = new JSONObject();
	    		try {
	    			result.put("response", txt.getText());
	    		} catch(Exception e) {
	    			e.printStackTrace();
	    		}
				sendToEnyo(result);
	    	}
	    });
	}
	
	public void setText(JSONObject params) {
		try {
			txt.setText(params.getString("text"));
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
}
