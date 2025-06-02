import { Resend } from 'resend';



const resendEmail = async (recipient,{subject,body,name}) => {
    const resend = new Resend(process.env.RESENT_SECRETE_KEY);
    const { data, error } = await resend.emails.send({
        from: `${name} <onboarding@resend.dev>`,
        to:recipient,
        subject: subject,
        html: body,
    });

    if (error) {
        return console.error({ error });
    }

    console.log({ data });

}

export default resendEmail;

