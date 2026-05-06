import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function Home() {
  return (
    <div className="grid gap-300 p-400">
      <Button variant="primary">Placeholder</Button>
      <Button variant="secondary">Placeholder</Button>
      <Button variant="tertiary">Placeholder</Button>
      <Input label="Basic Field" placeholder="Placeholder" prefix="$" />
      <Select
        label="Category"
        options={[
          {
            label: 'Latest',
            value: 'latest',
          },
          {
            label: 'Oldest',
            value: 'oldest',
          },
          {
            label: 'A to Z',
            value: 'a-z',
          },
          {
            label: 'Z to A',
            value: 'z-a',
          },
          {
            label: 'Highest',
            value: 'highest',
          },
          {
            label: 'Lowest',
            value: 'lowest',
          },
        ]}
        placeholder="Select a category"
      />
      <Card title="Budgets" action={{ label: 'See Details' }}>
        <div>gráfico e lista de budgets</div>
      </Card>
    </div>
  );
}
