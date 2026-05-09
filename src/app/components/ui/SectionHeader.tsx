export function SectionHeader(props: any) {
  const { label, heading } = props;
  return (
    <div className="flex flex-col gap-4">
      <h6 className="text-secondary">{label}</h6>
      <h3>{heading}</h3>
    </div>
  );
}
