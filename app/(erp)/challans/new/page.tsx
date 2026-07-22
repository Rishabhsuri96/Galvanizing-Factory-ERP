import ChallanForm from "@/components/ChallanForm";
import { prisma } from "@/lib/prisma";
import { createChallan } from "./actions";
export default async function NewChallanPage() {

    const [parties, itemCategories] =
        await Promise.all([
            prisma.party.findMany({
                where: {
                    isActive: true,
                },
                orderBy: {
                    partyName: "asc",
                },
                select: {
                    id: true,
                    partyName: true,
                },
            }),
            prisma.itemCategory.findMany({
                where: {
                    isActive: true,
                },
                orderBy: {
                    name: "asc",
                },
                select: {
                    id: true,
                    name: true,
                },
            }),
        ]);

    return (
        <div className="max-w-5xl">

            <h1 className="text-3xl font-bold mb-6">
                New Inward Challan
            </h1>

            <form action={createChallan}>
                <ChallanForm
                    parties={parties}
                    itemCategories={itemCategories}
                />
            </form>

        </div>
    );
}
