import { render } from "@react-email/components"
import SendPaymentEmail from '../components/email/Welcome';


export const PayEmailNotification = async ({link, recipentName, address, email, subjectLine}) => {
    const emailHtml = render(<SendPaymentEmail userFirstname={recipentName} address={address} link={link} content={subjectLine} />);

    console.log("Generated email HTML:", emailHtml);
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'codestrom808@gmail.com',
          reciever: email,
          subject: subjectLine,
          message: emailHtml,
        }),
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };



  export const RemitanceEmailNotification = async ({link, recipentName, address, email, subjectLine}) => {
    const emailHtml = render(<SendPaymentEmail userFirstname={recipentName} address={address} link={link} content={subjectLine} />);

    console.log("Generated email HTML:", emailHtml);
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'codestrom808@gmail.com',
          reciever: email,
          subject: subjectLine,
          message: emailHtml,
        }),
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };