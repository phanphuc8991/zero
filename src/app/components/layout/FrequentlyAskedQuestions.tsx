import { SectionHeader } from "@/app/components/ui/SectionHeader";
import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
const faqData = [
  {
    question: "1. Is there a free trial available?",
    answer:
      "Yes, we offer a free trial period so you can explore our platform and features before committing to a plan. No credit card is required to start.",
  },
  {
    question: "2. Can I cancel my subscription anytime?",
    answer:
      "Absolutely! You can cancel your subscription at any time from your account settings. There are no long-term contracts or cancellation fees.",
  },
  {
    question: "3. What’s included in the Free Plan?",
    answer:
      "The Free Plan includes access to a limited selection of courses, community support, and basic learning features. It's a great way to get started and see what we offer.",
  },
  {
    question: "4. Do I get a certificate after completing a course?",
    answer:
      "Yes, once you successfully complete a course, you will receive a digital certificate that you can download and share on LinkedIn or your resume.",
  },
  {
    question: "5. How does the Pro Plan differ from the Basic Plan?",
    answer:
      "The Pro Plan offers advanced features such as exclusive content, personalized mentorship, progress tracking, and priority support, while the Basic Plan provides access to core learning materials only.",
  },
];

export function FrequentlyAskedQuestions() {
  return (
    <div className="container">
      <div className="py-11 md:py-20 flex flex-col gap-10 md:gap-12">
        <SectionHeader label="Pricing" heading="All You Need to Know" />
      </div>
      <Accordion.Root type="single" className="flex flex-col gap-4" collapsible>
        {faqData.map((data, index) => (
          <Accordion.Item
            key={index}
            value={`${index}`}
            className="py-4 lg:py-7 px-3 lg:px-6 border border-primary/20 dark:border-creamwhite/20 rounded-2xl "
          >
            <Accordion.Header className="flex">
              <Accordion.Trigger className="text-left flex cursor-pointer text-sm font-medium justify-between items-center flex-1 [&[data-state=open]>#plusicon]:rotate-45">
                <h5>{data.question}</h5>
                <div
                  id="plusicon"
                  className="border border-black dark:border-creamwhite p-1 lg:p-3 rounded-full transition-transform duration-300 ease-in-out"
                >
                  <Plus size={24} />
                </div>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden text-sm data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
              <h6 className="text-primary/70 dark:text-creamwhite/70 pt-4">
                {data.answer}
              </h6>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
