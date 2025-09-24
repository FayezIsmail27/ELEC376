#include <iostream>
#include <string>
using namespace std; 
int main() {
    
    string alphabet {"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"};
    string key  {"XZNLWEBGJHQDYVTKFUOMPCIASRxznlwebgjhqdyvtkfuompciasr"};
    string secret; 

    cout << "enter a secret message " << endl; 
    getline(cin, secret);  
    //cout << secret; 

    string encrypted{}; 
    char character{}; 
    int i = 0; 

    while(i < secret.size()){
        
        character = secret.at(i); 
        if (isspace(character)){
            encrypted.push_back(' '); 
            i++; 
        }
        else {
            int index = alphabet.find(character); 
            encrypted.push_back(key.at(index)); 
            i++; 
        }
    }
    cout << "encrypted message " << encrypted << endl; 

    string decrypt{}; 
    char charact {}; 
    int j = 0;
    while(j < encrypted.size()){
        
        charact = encrypted.at(j); 
        if (isspace(charact)){
            decrypt.push_back(' '); 
            j++; 
        }
        else {
            int index = key.find(charact); 
            decrypt.push_back(alphabet.at(index)); 
            j++; 
        }
    }

    cout << "decrypted message " << decrypt << endl; 
    return 0;

}
