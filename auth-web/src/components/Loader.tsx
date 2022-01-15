import clsx from 'clsx';

interface Props {
  className?: string;
}

const Loader = ({ className }: Props) => {
  return (
    <div className={clsx('loader', className)}>
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};

export default Loader;
