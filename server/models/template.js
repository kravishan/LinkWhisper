const generateEmailContent = (shortUrl) => {
    const htmlEmail = `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html dir="ltr" lang="en">
  
      <head>
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
      </head>
      <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Here is the link you requested<div> &#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;</div>
      </div>
  
      <body style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
        <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:560px;margin:0 auto;padding:20px 0 48px">
          <tbody>
            <tr style="width:100%">
              <td>
                <h1 style="font-size:24px;letter-spacing:-0.5px;line-height:1.3;font-weight:400;color:#484848;padding:17px 0 0">Here is the link you requested</h1>
                <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:27px 0 27px">
                  <tbody>
                    <tr>
                      <td>
                    </tr>
                  </tbody>
                </table>
                <p style="font-size:15px;line-height:1.4;margin:0 0 15px;color:#3c4149">This link and code will be valid until the owner deletes it</p><code style="font-family:monospace;font-weight:700;padding:1px 4px;background-color:#dfe1e4;letter-spacing:-0.3px;font-size:21px;border-radius:4px;color:#3c4149"><a href="http://localhost:8000/${shortUrl}" target="_blank">${shortUrl}</a></code>
                <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#dfe1e4;margin:42px 0 26px" /><a href="" style="color:#b4becc;text-decoration:none;font-size:14px" target="_blank">LINKWHISPER</a>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
  
      </html>
    `;
    return htmlEmail;
  };
  
  export default generateEmailContent;
  