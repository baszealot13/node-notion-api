import { Client } from '@notionhq/client';

export default class NotionClient {
    client;
    databaseId = '{database-id}';

    constructor() {
        this.client = new Client({
            auth: 'secret_{notion_integration}'
        });
    }

    async getPeople() {
        const people = await this.client.databases.query({
            database_id: this.databaseId
        });

        let response = [];

        for (const row of people.results) {
            const prop = row.properties;
            
            response.push({
                page_id: row.id,
                ppl_id: prop.ppl_id.title[0].text.content,
                first_name: prop.first_name.rich_text[0].text.content,
                last_name: prop.last_name.rich_text[0].text.content,
                email: prop.email.email,
                ip_address: prop.ip_address.rich_text[0].text.content,
                salary_rate: await this.peopleGetSalary(prop['Related to Salary rate (People)'].relation)
            });
        };

        return response;
    }

    async peopleGetSalary(salaries) {
        let results = [];

        for (const salary of salaries) {
            results.push(this.client.pages.retrieve({ page_id: salary.id} ));
        }

        return (await Promise.all(results)).map((row) => {
            return row.properties['Salaries'].title[0].text.content;
        });
    }

    async setPeople(data, id=null) {
        if (!id) {
            return await this.client.pages.create(data);
        } else {
            return await this.client.pages.update({
                page_id: id,
                properties: data
            });
        }
    }
}