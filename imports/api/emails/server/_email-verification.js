export default ({ user, url }) => (
  `
<div>
<center>
<h2 style='color: #222; font-weight: lighter; text-align: center'>
<span style='padding: 2px 6px 2px 6px;background-color: rgb(236, 236, 236); border-radius: 5px; border: 1px solid rgb(121, 121, 121);'>
<span class='i-logo' style='color: #FE0303'>i</span>
<span class='s-logo' style='color: #0396F2'>S</span>
</span> Confirm your email address</h2>
</center>
<hr style='border: 0; height: 0; border-top: 1px solid rgba(0, 0, 0, 0.1); border-bottom: 1px solid rgba(255, 255, 255, 0.3);'>
<h3 style='color: #222; font-weight: lighter;'>Hello ${user.username},</h3>
<h3 style='color: #222; font-weight: lighter;'> To verify your account email, simply click the link below.</h3>
<h3 style='color: #222; font-weight: lighter;'>
<a href='${url}'>${url}</a>
</h3>
<h3 class='text-left email-footer' style='color: #222; font-weight: lighter;'> Thanks,<br> The <span class='i-logo' style='color: #FE0303'>in</span>
<span class='s-logo' style='color: #0396F2'>Slim</span> Team </h3> <hr style='border: 0; height: 0; border-top: 1px solid rgba(0, 0, 0, 0.1); border-bottom: 1px solid rgba(255, 255, 255, 0.3);'>
</div>
`
);

