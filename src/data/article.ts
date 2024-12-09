export interface Article {
    id: number;
    title: string;
    description: string;
    content: string;
    image_url: string;
    status: "PUBLISHED" | "DRAFT";
    created_at: string;
}