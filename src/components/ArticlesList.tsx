
import ArticleCard from './ArticleCard';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

// Sample articles data
const articles: Article[] = [
  {
    id: 1,
    title: "Apple's New iCar Requires AppleCare+ Just to Start the Engine",
    excerpt: "In a move surprising absolutely nobody, Apple's new automotive venture requires a subscription just to perform basic functions.",
    date: "2023-05-15",
    category: "Products"
  },
  {
    id: 2,
    title: "Meta Unveils 'Actual Reality' Platform for Users Who Need a Break from the Metaverse",
    excerpt: "In a shocking departure from its usual strategy, Mark Zuckerberg announced a new platform that encourages people to look up from their screens.",
    date: "2023-05-12",
    category: "Social Media"
  },
  {
    id: 3,
    title: "Amazon's New Delivery Drones Now Come With Complimentary Therapy Sessions",
    excerpt: "After detecting concerning levels of anxiety in most American households, Amazon's drones will now offer basic counseling alongside your packages.",
    date: "2023-05-10",
    category: "E-commerce"
  },
  {
    id: 4,
    title: "Microsoft's New AI Assistant Keeps Taking Smoke Breaks and Calling in Sick",
    excerpt: "Users report that the latest AI from Microsoft frequently claims to 'have a thing' and needs to 'step out for a minute.'",
    date: "2023-05-08",
    category: "AI & ML"
  },
  {
    id: 5,
    title: "Google's Latest Algorithm Update Ranks Websites Based on How Many Cats They Feature",
    excerpt: "SEO experts are scrambling to add feline content to every page after Google's surprise 'Purr-Core' update changed the search landscape overnight.",
    date: "2023-05-05",
    category: "Search"
  },
  {
    id: 6,
    title: "Tesla Announces Self-Driving Feature That Just Drives Back to the Dealership When It's Had Enough",
    excerpt: "The latest update from Tesla includes an 'I Quit' function that activates when the car detects it's being asked to parallel park for the third time in a day.",
    date: "2023-05-02",
    category: "Automotive"
  }
];

const ArticlesList = () => {
  return (
    <section id="latest-articles" className="container mx-auto px-6 py-16">
      <div className="max-w-4xl mx-auto mb-12 text-center space-y-2">
        <h2 className="text-3xl font-medium tracking-tight">Latest Articles</h2>
        <p className="text-muted-foreground">
          Fresh satirical takes on the most recent tech developments
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <ArticleCard
            key={article.id}
            id={article.id}
            title={article.title}
            excerpt={article.excerpt}
            date={article.date}
            category={article.category}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default ArticlesList;
