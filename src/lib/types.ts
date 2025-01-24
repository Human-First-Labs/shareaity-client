export interface IUser {
    id: string;
    createdAt: Date;
    updatedAt: Date | null;
    supabaseUid: string | null;
    displayName: string | null;
    blocked: boolean;
    acceptedTermsOn: Date | null;
    imagePaths: string[];
    contactInfo: {
        email: {
            email: string
            verified: boolean
        } | null,
        phone: {
            phone: string,
            whatsapp: boolean
        } | null
    } | null;
}