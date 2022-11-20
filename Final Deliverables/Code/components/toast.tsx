export default function Toast({ msg }: any) {
  return (
    <div className="toast">
      <div className="alert alert-error shadow-lg">
        <div>
          <span>{msg}</span>
        </div>
      </div>
    </div>
  );
}
