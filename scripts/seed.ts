import { ObjectId } from 'mongodb';
import { connectToDatabase, Collections } from '../lib/mongodb';
import { Article, Author, Topic } from '../types';
import { calculateReadingTime } from '../lib/seo';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    const { db } = await connectToDatabase();

    // Create topics
    const topics: Topic[] = [
      {
        slug: 'serums',
        title: 'Serums',
        description: 'Potent skincare treatments for targeted concerns',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        slug: 'moisturizers',
        title: 'Moisturizers',
        description: 'Hydrating products for all skin types',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        slug: 'cleansers',
        title: 'Cleansers',
        description: 'Gentle cleansing solutions for healthy skin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        slug: 'masks',
        title: 'Masks',
        description: 'Intensive treatments for deep nourishment',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        slug: 'sunscreen',
        title: 'Sunscreen',
        description: 'Essential UV protection for daily wear',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        slug: 'tools',
        title: 'Tools',
        description: 'Devices and accessories for skincare routines',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    console.log('Inserting topics...');
    const topicsResult = await db.collection(Collections.TOPICS).insertMany(topics);

    // Create author
    const author: Author = {
      name: 'Dr. Sarah Johnson',
      bio: 'Board-certified dermatologist with 15+ years of experience in clinical skincare.',
      credentials: ['MD', 'Board-Certified Dermatologist', 'Clinical Researcher'],
      social: {
        twitter: '@drsarahskin',
        instagram: '@drsarahjohnson',
        website: 'https://drsarahjohnson.com',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log('Inserting author...');
    const authorResult = await db.collection(Collections.AUTHORS).insertOne(author);
    const authorId = authorResult.insertedId;

    // Create sample articles
    const articles: Article[] = [
      {
        slug: 'the-radiance-edit-augustinus-bader-the-rich-cream',
        title: 'The Radiance Edit: Augustinus Bader The Rich Cream',
        summary: 'An in-depth review of the luxury moisturizer that promises to transform your skin with innovative TFC8 technology.',
        bodyHtml: `
          <h2>The Holy Grail of Luxury Skincare</h2>
          <p>Augustinus Bader's The Rich Cream has taken the beauty world by storm, and for good reason. This luxurious moisturizer combines cutting-edge science with premium ingredients to deliver visible results.</p>
          
          <h3>Key Ingredients</h3>
          <ul>
            <li>TFC8® - Trigger Factor Complex for skin renewal</li>
            <li>Vitamin E - Powerful antioxidant protection</li>
            <li>Squalane - Deep hydration without heaviness</li>
            <li>Evening Primrose Oil - Nourishing and soothing</li>
          </ul>
          
          <h3>My Experience</h3>
          <p>After 8 weeks of consistent use, I noticed significant improvements in skin texture, hydration, and overall radiance. The cream absorbs beautifully and works well under makeup.</p>
          
          <h3>Who It's For</h3>
          <p>This is ideal for dry to normal skin types seeking intensive hydration and anti-aging benefits. While pricey, a little goes a long way.</p>
          
          <h3>Final Verdict</h3>
          <p>If you're looking to invest in your skincare routine, The Rich Cream is worth considering. It's a true luxury product that delivers on its promises.</p>
        `,
        authorId,
        topics: ['moisturizers'],
        keywords: ['augustinus bader', 'rich cream', 'luxury moisturizer', 'tfc8', 'anti-aging'],
        status: 'published',
        publishedAt: new Date('2024-01-15'),
        rating: 4.5,
        viewCount: 2500,
        seo: {
          title: 'The Radiance Edit: Augustinus Bader The Rich Cream Review',
          description: 'An in-depth review of Augustinus Bader The Rich Cream. Is this luxury moisturizer worth the investment? Find out in our detailed analysis.',
          keywords: ['augustinus bader review', 'the rich cream', 'luxury skincare', 'tfc8 technology'],
        },
        locale: 'en',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        slug: 'best-vitamin-c-serums-2024',
        title: 'The 10 Best Vitamin C Serums for Glowing Skin in 2024',
        summary: 'Discover the top-rated vitamin C serums that brighten, protect, and transform your complexion.',
        bodyHtml: `
          <h2>Why Vitamin C is Essential</h2>
          <p>Vitamin C is one of the most researched and effective skincare ingredients. It brightens skin, fades dark spots, and protects against environmental damage.</p>
          
          <h3>Top Picks</h3>
          <ol>
            <li><strong>SkinCeuticals C E Ferulic</strong> - The gold standard for antioxidant protection</li>
            <li><strong>Drunk Elephant C-Firma</strong> - Potent 15% vitamin C with ferulic acid</li>
            <li><strong>Timeless Vitamin C Serum</strong> - Budget-friendly option with proven results</li>
            <li><strong>Mad Hippie Vitamin C Serum</strong> - Gentle formula for sensitive skin</li>
            <li><strong>Paula's Choice C15 Booster</strong> - Versatile and effective</li>
          </ol>
          
          <h3>How to Use</h3>
          <p>Apply vitamin C serum in the morning after cleansing and before moisturizer. Always follow with sunscreen for maximum protection.</p>
        `,
        authorId,
        topics: ['serums'],
        keywords: ['vitamin c serum', 'brightening', 'dark spots', 'antioxidants', 'skincare review'],
        status: 'published',
        publishedAt: new Date('2024-01-20'),
        rating: 5,
        viewCount: 3200,
        seo: {
          title: 'Best Vitamin C Serums 2024 - Expert Reviews',
          description: 'Find the perfect vitamin C serum for glowing skin. Our expert reviews of the top 10 vitamin C serums for all skin types and budgets.',
          keywords: ['best vitamin c serum', 'vitamin c reviews', 'brightening serum', 'skincare 2024'],
        },
        locale: 'en',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-20'),
      },
      {
        slug: 'double-cleansing-method-guide',
        title: 'The Complete Guide to Double Cleansing',
        summary: 'Learn the Korean beauty secret for perfectly clean, glowing skin.',
        bodyHtml: `
          <h2>What is Double Cleansing?</h2>
          <p>Double cleansing is a two-step cleansing method that starts with an oil-based cleanser followed by a water-based cleanser.</p>
          
          <h3>Step 1: Oil Cleanser</h3>
          <p>The first step removes makeup, sunscreen, and sebum. Oil dissolves oil, making this the most effective way to remove stubborn products.</p>
          
          <h3>Step 2: Water-Based Cleanser</h3>
          <p>The second cleanse removes any remaining impurities and ensures your skin is perfectly clean.</p>
          
          <h3>Best Products</h3>
          <ul>
            <li>DHC Deep Cleansing Oil</li>
            <li>Banila Co Clean It Zero</li>
            <li>CeraVe Hydrating Cleanser</li>
            <li>La Roche-Posay Toleriane Cleanser</li>
          </ul>
        `,
        authorId,
        topics: ['cleansers'],
        keywords: ['double cleansing', 'korean skincare', 'cleansing method', 'oil cleanser'],
        status: 'published',
        publishedAt: new Date('2024-01-25'),
        rating: 4.8,
        viewCount: 1800,
        seo: {
          title: 'Double Cleansing Guide - Perfect Skin in 2 Steps',
          description: 'Master the double cleansing method with our complete guide. Learn which products work best and how to get glowing skin.',
          keywords: ['double cleansing guide', 'how to double cleanse', 'korean skincare routine'],
        },
        locale: 'en',
        createdAt: new Date('2024-01-23'),
        updatedAt: new Date('2024-01-25'),
      },
    ];

    // Calculate reading time for articles
    articles.forEach((article) => {
      article.readingTime = calculateReadingTime(article.bodyHtml);
    });

    console.log('Inserting articles...');
    await db.collection(Collections.ARTICLES).insertMany(articles);

    console.log('✅ Database seeded successfully');
    console.log(`   - ${topics.length} topics`);
    console.log(`   - 1 author`);
    console.log(`   - ${articles.length} articles`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
