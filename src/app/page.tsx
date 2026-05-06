import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function Home() {
  return (
    <>
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
    </>
  );
}
