import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth/auth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Dialog, DialogClose } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { BottomNav } from "@/components/ui/BottomNav";
import { Sidebar } from "@/components/ui/Sidebar";

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex gap-1000">
      <Sidebar />
      <BottomNav />
      <main className="grid w-full gap-300 p-400 pb-24 lg:pb-400">
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <Button type="submit" variant="secondary" className="w-auto px-400">
            Logout (test)
          </Button>
        </form>

        <Button variant="primary">Placeholder</Button>
        <Button variant="secondary">Placeholder</Button>
        <Button variant="tertiary">Placeholder</Button>
        <Input label="Basic Field" placeholder="Placeholder" prefix="$" />
        <Select
          label="Category"
          options={[
            { label: "Latest", value: "latest" },
            { label: "Oldest", value: "oldest" },
            { label: "A to Z", value: "a-z" },
            { label: "Z to A", value: "z-a" },
            { label: "Highest", value: "highest" },
            { label: "Lowest", value: "lowest" },
          ]}
          placeholder="Select a category"
        />
        <Card title="Budgets" action={{ label: "See Details" }}>
          <div>gráfico e lista de budgets</div>
        </Card>

        <Dialog
          trigger={<Button type="button">Open dialog</Button>}
          title="Add transaction"
          description="Create a new transaction for your personal finance overview."
          footer={
            <>
              <Button type="button">Save transaction</Button>
            </>
          }
        >
          <div className="grid gap-400">
            <Input
              label="Transaction name"
              placeholder="e.g. Grocery shopping"
            />
            <Input
              label="Amount"
              prefix="$"
              placeholder="0.00"
              inputMode="decimal"
            />
          </div>
        </Dialog>

        <Dialog
          trigger={
            <Button type="button" variant="destructive">
              Delete budget
            </Button>
          }
          title="Delete budget?"
          description="This action cannot be undone."
          footer={
            <>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" variant="destructive">
                Delete
              </Button>
            </>
          }
        >
          <p>
            Removing this budget will keep existing transactions, but the budget
            tracking card will disappear from your dashboard.
          </p>
        </Dialog>
      </main>
    </div>
  );
}
