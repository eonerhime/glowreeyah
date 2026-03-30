import EventForm from '@/components/cms/EventForm';
import CMSPageHeader from '@/components/cms/CMSPageHeader';

export default function NewEventPage() {
  return (
    <div>
      <CMSPageHeader
        title="New Event"
        createHref="/cms/events"
        createLabel="Back to Events"
      />
      <div className="mt-6">
        <EventForm />
      </div>
    </div>
  );
}
