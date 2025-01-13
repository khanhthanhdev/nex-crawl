import { SetupUser } from "@/actions/billing/setupUser";
import { waitFor } from "@/lib/helper/waitFor";


export default async function SetupPage(){
    waitFor(5000);
    return await SetupUser();
}

