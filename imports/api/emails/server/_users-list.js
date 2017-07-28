export default ({ receiverFirstName, url, subject, body, users }) => (
  `
<div>
<div style="text-align: center">
  <h2 style='color: #222; font-weight: lighter; text-align: center'>
  <span style='padding: 2px 6px 2px 6px;background-color: rgb(236, 236, 236); border-radius: 5px; border: 1px solid rgb(121, 121, 121); margin-right: 5px'>
    <span class='i-logo' style='color: #FE0303'>i</span>
    <span class='s-logo' style='color: #0396F2'>S</span>
  </span> ${subject}</h2>
</div>
<hr style='border: 0; height: 0; border-top: 1px solid rgba(0, 0, 0, 0.1); border-bottom: 1px solid rgba(255, 255, 255, 0.3);'>
<h3 style='color: #222; font-weight: lighter;'>Hello ${receiverFirstName},</h3>
<h3 style='color: #222; font-weight: lighter;'>${body}</h3>
<table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="max-width: 600px;" id="bodyTable">
  <tr>
    <td left="left" valign="top">
      <table border="0" cellpadding="5" cellspacing="0" width="100%" style="max-width: 600px;" id="emailContainer">
        <tr>
          <td align="left" valign="top">
            <table border="0" cellpadding="10" cellspacing="0" width="100%" id="emailSignature">
              ${users.map(u => `
                <tr>
                <td align="left" valign="top" style="font-family: arial;">
                  ${u.image ? `<a href="${url}profile/${u.username}"><img width="32" height="32" alt="${u.username}" src="${u.image}" style="-ms-interpolation-mode: bicubic; -webkit-background-clip: padding-box; -webkit-border-radius: 20px; background-clip: padding-box; border-radius: 20px; display: inline-block; height: 40px; max-width: 100%; outline: none; text-decoration: none; width: 40px; vertical-align: middle; margin-right: 10px;"></a>`: '' }
                  <p style="font-family: arial; display: inline-block; vertical-align: middle; color: #3A4557; font-size: 16px"><a style="font-family: arial; display: inline-block; vertical-align: middle; color: #3A4557; font-size: 16px" href="${url}profile/${u.username}">${u.username}</a> <span style="font-family: arial; color:#8B97AD; margin-top: 3px; display: block; font-size: 13px;">${u.emailText}</span></p>
                </td>
              </tr>
              `).join('')}
            </table>
          </td>
        </tr>
      </table>
<h3 style='color: #222; font-weight: lighter;'>
<a href='${url}'>${url}</a>
</h3>
<h3 class='text-left email-footer' style='color: #222; font-weight: lighter;'> Thanks,<br> The <span class='i-logo' style='color: #FE0303'>in</span>
<span class='s-logo' style='color: #0396F2'>Slim</span> Team </h3> <hr style='border: 0; height: 0; border-top: 1px solid rgba(0, 0, 0, 0.1); border-bottom: 1px solid rgba(255, 255, 255, 0.3);'>
</div>
`
);
