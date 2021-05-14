import TopBar from '~/components/TopBar';
import CreateBrandForm from '~/components/CreateBrandForm';

export default function NewBrand() {
  return (
    <div className="page-container">
      <TopBar />
      <div className="page-body-container">
        <main className="flex flex-col justify-around flex-grow flex-shrink-0 py-6">
          <div className="form-container">
            <CreateBrandForm />
          </div>
        </main>
      </div>
    </div>
  );
}
