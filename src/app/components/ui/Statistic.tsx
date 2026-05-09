export function Statistic(props: any) {
    const {data} = props;
  return (
    <div className="flex flex-col gap-2">
      <h2 className="lg:text-7xl text-5xl">
        <span>{data.count}</span>
        <span>+</span>
      </h2>
      <h6 className="text-primary/70 dark:text-creamwhite/70">{data.label}</h6>
    </div>
  );
}
